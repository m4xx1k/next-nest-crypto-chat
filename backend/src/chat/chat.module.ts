import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoomService } from 'src/room/room.service';
import { TransactionService } from 'src/transaction/transaction.service';
import { ChatGateway } from './chat.gateway';

@Module({
  providers: [ChatGateway, RoomService, PrismaService, TransactionService],
  imports: [],
})
export class ChatModule {}
