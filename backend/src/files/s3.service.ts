import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
  private s3: S3Client;
  private bucket: string;
  private region: string;

  constructor() {
    this.region = process.env.AWS_REGION || 'eu-central-1';
    this.bucket = process.env.AWS_S3_BUCKET || '';

    this.s3 = new S3Client({
      region: this.region,
      // If not provided, SDK uses env/shared config/role automatically
      credentials:
        process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
          ? {
              accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
            }
          : undefined,
    });
  }

  private publicUrlForKey(key: string) {
    return this.region === 'us-east-1'
      ? `https://${this.bucket}.s3.amazonaws.com/${key}`
      : `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }

  async uploadImage(buffer: Buffer, contentType: string, key: string): Promise<string> {
    if (!this.bucket) throw new Error('AWS_S3_BUCKET is not configured');

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        ACL: 'public-read', // for quick dev; consider private + CloudFront in prod
      }),
    );

    return this.publicUrlForKey(key);
  }

  async getPresignedPutUrl(key: string, contentType: string, expiresInSec = 60) {
    if (!this.bucket) throw new Error('AWS_S3_BUCKET is not configured');

    const url = await getSignedUrl(
      this.s3,
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        ContentType: contentType,
      }),
      { expiresIn: expiresInSec },
    );

    return { url, publicUrl: this.publicUrlForKey(key), key, expiresIn: expiresInSec };
  }
}
