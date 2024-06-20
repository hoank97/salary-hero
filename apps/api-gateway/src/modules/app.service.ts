import { Inject, Injectable } from '@nestjs/common';
import { clients } from '../config/client-proxy.config';
import { ClientProxy } from '@nestjs/microservices';
import { MsMessagePatterns } from '../config/pattern.config';
import { firstValueFrom, timeout } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    @Inject(clients.WITHDRAW.name) private msWithdraw: ClientProxy,
    @Inject(clients.CORE.name) private msCore: ClientProxy,
    @Inject(clients.CRON.name) private msCron: ClientProxy,
  ) {}
  async getHealth() {
    const services = [
      {
        name: clients.WITHDRAW.name,
        client: this.msWithdraw,
        pattern: MsMessagePatterns.withdraw.health,
      },
      {
        name: clients.CORE.name,
        client: this.msCore,
        pattern: MsMessagePatterns.core.health,
      },
      {
        name: clients.CRON.name,
        client: this.msCron,
        pattern: MsMessagePatterns.cron.health,
      },
    ];

    const status = await Promise.all(
      services.map(async (client) => {
        const message = client.client.send<any, any>(client.pattern, {}).pipe(timeout(500));
        let result;
        try {
          result = await firstValueFrom(message);
        } catch (err) {}
        return {
          service: client.name,
          status: result ? 'up' : 'down',
        };
      }),
    );

    return [
      {
        service: 'api-gateway',
        status: 'up',
      },
      ...status,
    ];
  }
}
