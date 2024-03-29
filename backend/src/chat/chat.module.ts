import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RoomService } from 'src/room/room.service';
import { TransactionModule } from 'src/transaction/transaction.module';
import { ChatGateway } from './chat.gateway';

@Module({
  providers: [ChatGateway, RoomService],
  imports: [PrismaModule, TransactionModule],
})
export class ChatModule {}
