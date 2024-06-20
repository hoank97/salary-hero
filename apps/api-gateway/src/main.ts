import { NestFactory } from '@nestjs/core';
import { swaggerConfig } from './config/swagger.config';
import { httpConfig } from './config/http.config';
import { Logger } from '@nestjs/common';
import { ApiGatewayModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  swaggerConfig(app);
  httpConfig(app);

  await app.listen(process.env.APP_PORT_CONTAINER, () => {
    Logger.log(`Server is running on ::: http://${process.env.APP_HOST}:${process.env.APP_PORT_EXPOSE}/swagger`);
  });
}
bootstrap();
