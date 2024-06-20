import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmConfig } from './app.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobsModule } from './jobs/jobs.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { WorkingDayModule } from './working-day/working-day.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRoot(typeOrmConfig),
    JobsModule,
    UsersModule,
    WorkingDayModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
