import { INestApplication, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';

export const httpConfig = (app: INestApplication) => {
  // Using helmet
  app.use(helmet());

  // Enable CORS
  app.enableCors();

  // Apply rate limit
  app.use(
    rateLimit({
      windowMs: 60 * 1000, // 1 minutes
      limit: 100, // Limit each IP to 100 requests per `window` (here, per 1 minutes).
      standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    }),
  );

  // Use global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
};
