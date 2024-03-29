import { Injectable } from '@nestjs/common';
import { TXID } from 'src/chat/chat.interfaces';
import Web3 from 'web3';
// #FIXME: Replace key with key from .env
const web3 = new Web3(
  `https://mainnet.infura.io/v3/1fcf69afb1d24d458597f02be4e351d4`,
);
@Injectable()
export class TransactionService {
  async getTransactionInfo(txid: string): Promise<TXID | null> {
    try {
      const transaction = await web3.eth.getTransaction(txid);
      const block = await web3.eth.getBlock(transaction.blockNumber);
      if (!transaction || !block) return null;
      return {
        id: txid,
        from: transaction.from,
        to: transaction.to,
        amount: web3.utils.fromWei(transaction.value, 'ether'),
        date: new Date(Number(block.timestamp) * 1000),
      };
    } catch (e) {
      console.error(e);
      return null;
    }
  }
  async getTXIDsInfo(message: string): Promise<TXID[]> {
    const txids = message.match(/0x[a-fA-F0-9]{64}/g);
    if (txids) {
      const txidsInfo = await Promise.all(txids.map(this.getTransactionInfo));
      return txidsInfo.filter(Boolean);
    }
    return [];
  }
}
