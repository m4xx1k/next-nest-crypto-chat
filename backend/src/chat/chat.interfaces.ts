import { User } from '@prisma/client';

export interface Message {
  id: number;
  timeSent: string;
  text: string;
  roomName: string;
  txids?: TXID[];
}
export type TXID = {
  id: string;
  from: string;
  to: string;
  amount: string;
  date: Date;
};
export interface ServerToClientEvents {
  chat: (e: Message) => void;
}

export interface ClientToServerEvents {
  chat: (e: Message) => void;
  join_room: (e: { user: User; roomName: string }) => void;
}
