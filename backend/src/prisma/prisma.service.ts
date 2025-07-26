import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/index';
@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      datasources: {
        db: {
          url: 'postgresql://postgres:123@localhost:5434/nest',
        },
      },
    });
  }
}
