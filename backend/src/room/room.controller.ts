import { Controller, Get, Param } from '@nestjs/common';
import { Room } from '@prisma/client';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {
  constructor(private roomService: RoomService) {}

  @Get('get-all-rooms')
  async getAllRooms(): Promise<Room[]> {
    return this.roomService.getRooms();
  }

  @Get('get-room-by-name/:room')
  async getRoom(@Param() params): Promise<Room> {
    return this.roomService.getRoomByName(params.room);
  }
}
