import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { msClient } from '../config/client-proxy.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    ClientsModule.register({
      isGlobal: true,
      clients: Object.values(msClient),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class ApiGatewayModule {}
