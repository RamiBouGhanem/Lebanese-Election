import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { IncidentsService } from './incidents.service';
import { UsersService } from '../users/users.service';

/** Decode a JWT without verifying signature (dev-friendly fallback) */
function decodeJwtNoVerify(bearerOrToken?: string): any | null {
  try {
    if (!bearerOrToken) return null;
    const token = bearerOrToken.startsWith('Bearer ')
      ? bearerOrToken.slice(7)
      : bearerOrToken;
    const payloadB64 = token.split('.')[1];
    if (!payloadB64) return null;
    const json = Buffer.from(
      payloadB64.replace(/-/g, '+').replace(/_/g, '/'),
      'base64'
    ).toString('utf8');
    return JSON.parse(json);
  } catch {
    return null;
  }
}

@Controller('incidents')
export class IncidentsController {
  constructor(
    private svc: IncidentsService,
    private users: UsersService, // for username→id fallback on old tokens
  ) {}

  /** Resolve a stable user id from body, req.user, Authorization JWT, or username lookup */
  private async resolveUserId(req: any, bodyUserId?: string): Promise<string | undefined> {
    // 1) explicit from body (frontend fallback)
    if (bodyUserId) return String(bodyUserId);

    // 2) from JwtStrategy.validate() (new tokens)
    const u = req?.user;
    const fromReq = u?.userId || u?.user_id || u?.sub || u?._id || u?.id;
    if (fromReq) return String(fromReq);

    // 3) decode Authorization header (works even if guards are not applied)
    const auth =
      req?.headers?.authorization ||
      req?.headers?.Authorization ||
      req?.headers?.['x-access-token'];
    const decoded = decodeJwtNoVerify(auth);
    const fromJwt = decoded?.sub || decoded?._id || decoded?.id || decoded?.userId;
    if (fromJwt) return String(fromJwt);

    // 4) OLD TOKENS: only { username, role } — look up id by username
    const username: string | undefined = decoded?.username || u?.username;
    if (username) {
      const dbUser = await this.users.findByUsername(username);
      if (dbUser?._id) return String(dbUser._id);
    }

    return undefined;
  }

  /** POST /incidents — create an incident (dev-friendly auth) */
  @Post()
  async create(
    @Body()
    body: {
      centerId: string;
      station: string;
      severity: 'Low' | 'Medium' | 'High';
      category: 'Security' | 'Logistics' | 'Technical' | 'Other';
      description: string;
      userId?: string;      // optional fallback from client
      photos?: string[];
    },
    @Req() req: any,
  ) {
    const userId = await this.resolveUserId(req, body?.userId);
    if (!userId) throw new UnauthorizedException('Missing authenticated user');

    const required = ['centerId', 'station', 'severity', 'category', 'description'] as const;
    for (const k of required) {
      const v = (body as any)[k];
      if (!v || (typeof v === 'string' && !String(v).trim())) {
        throw new BadRequestException(`Field "${k}" is required`);
      }
    }

    return this.svc.createIncident({ ...body, userId });
  }

  /** GET /incidents/mine?centerId=... — only the caller's incidents */
  @Get('mine')
  async listMine(@Query('centerId') centerId: string, @Req() req: any) {
    const userId = await this.resolveUserId(req);
    if (!userId) throw new UnauthorizedException('Missing authenticated user');
    return this.svc.listMyIncidents(userId, centerId);
  }

  /** GET /incidents?centerId=... — shared listing by center (optional) */
  @Get()
  list(@Query('centerId') centerId: string) {
    return this.svc.listIncidents(centerId);
  }
}
