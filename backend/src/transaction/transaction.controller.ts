import { Controller, Get, Param } from '@nestjs/common';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}
  @Get(':txid')
  getTransactionInfo(@Param('txid') txid: string) {
    return this.transactionService.getTransactionInfo(txid);
  }
}
