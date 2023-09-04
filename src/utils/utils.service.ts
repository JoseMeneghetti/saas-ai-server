import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UtilsService {
  constructor(private config: ConfigService) {
    const apiKey = this.config.get<string>('FRONT_END_URL');
    if (!apiKey) throw new NotFoundException('Front-end URL not configured');
  }

  public absoluteUrl(path: string): string {
    const basePath = this.config.get<string>('FRONT_END_URL');
    return `${basePath}${path}`;
  }
}
