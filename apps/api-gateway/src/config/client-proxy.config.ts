import { ClientProviderOptions, Transport } from '@nestjs/microservices';
import { config } from 'dotenv';
config();

export const clients = {
  CORE: {
    name: 'core',
    urls: [`amqp://${process.env.RMQ_USERNAME}:${process.env.RMQ_PASSWORD}@${process.env.RMQ_HOST}:5672`],
    queue: 'core',
  },
  WITHDRAW: {
    name: 'withdraw',
    urls: [`amqp://${process.env.RMQ_USERNAME}:${process.env.RMQ_PASSWORD}@${process.env.RMQ_HOST}:5672`],
    queue: 'withdraw',
  },
  CRON: {
    name: 'cron',
    urls: [`amqp://${process.env.RMQ_USERNAME}:${process.env.RMQ_PASSWORD}@${process.env.RMQ_HOST}:5672`],
    queue: 'cron',
  },
};

export const msClient: Record<string, ClientProviderOptions> = {
  core: {
    name: clients.CORE.name,
    transport: Transport.RMQ,
    options: {
      urls: clients.CORE.urls,
      queue: clients.CORE.queue,
      noAck: true,
      queueOptions: {
        durable: true,
      },
    },
  },
  withdraw: {
    name: clients.WITHDRAW.name,
    transport: Transport.RMQ,
    options: {
      urls: clients.WITHDRAW.urls,
      queue: clients.WITHDRAW.queue,
      noAck: true,
      queueOptions: {
        durable: true,
      },
    },
  },
  cron: {
    name: clients.CRON.name,
    transport: Transport.RMQ,
    options: {
      urls: clients.CRON.urls,
      queue: clients.CRON.queue,
      noAck: true,
      queueOptions: {
        durable: true,
      },
    },
  },
};
