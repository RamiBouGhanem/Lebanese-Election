import { SetMetadata } from '@nestjs/common';

// usage: @Roles('citizen') or @Roles('representative') or @Roles('pollinghead')
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
