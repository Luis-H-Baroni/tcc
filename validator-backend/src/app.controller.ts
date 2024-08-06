import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ethers } from 'ethers';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(): Promise<string> {
    const provider = new ethers.JsonRpcProvider('http://0.0.0.0:8545');

    const account = await provider.listAccounts();

    const balance = provider.getBalance(account[1].address);
    return (await balance).toString();
  }
}
