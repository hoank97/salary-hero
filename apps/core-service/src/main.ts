import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './modules/app.module';
import startup from './startup';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [
          `amqp://${process.env.RMQ_USERNAME}:${process.env.RMQ_PASSWORD}@${process.env.RMQ_HOST}:5672`,
        ],
        noAck: true, // auto acknowledge
        queue: 'core',
        queueOptions: {
          durable: true,
        },
      },
    },
  );

  await app.listen();
  await startup(app);

}
bootstrap();
