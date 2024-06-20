import { Controller, Get, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @ApiOperation({ description: 'Get status of other applications' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Status of other applications',
  })
  getHealth() {
    return this.appService.getHealth();
  }
}
