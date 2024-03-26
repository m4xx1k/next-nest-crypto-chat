import { Injectable } from '@nestjs/common';
import { Prisma, Room, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}
  async getRoomByName(roomName: string): Promise<Room | null> {
    const room = await this.prisma.room.findUnique({
      where: { name: roomName },
    });
    return room;
  }

  async addRoom(roomName: string, host: User): Promise<void> {
    const room = await this.getRoomByName(roomName);
    if (room) return;
    await this.prisma.room.create({
      data: { name: roomName, hostId: host.id },
    });
  }

  async removeRoom(roomName: string): Promise<void> {
    const room = await this.getRoomByName(roomName);
    if (room) {
      await this.prisma.room.delete({ where: { name: roomName } });
    }
  }

  async getRoomHost(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return await this.prisma.user.findUnique({ where });
  }

  async addUserToRoom(
    roomName: string,
    user: User | Omit<User, 'id'>,
  ): Promise<void> {
    const room = await this.getRoomByName(roomName);
    let findUser = await this.prisma.user.findFirst({
      where: { socketId: user.socketId },
    });
    if (!findUser) {
      findUser = await this.prisma.user.create({ data: user });
    }
    if (room) {
      await this.prisma.userInRoom.create({
        data: {
          roomId: room.id,
          userId: findUser.id,
        },
      });
    } else {
      this.addRoom(roomName, findUser);
    }
  }

  async findRoomsByUserSocketId(socketId: string): Promise<Room[]> {
    const rooms = await this.prisma.room.findMany({
      include: { host: true },
      where: {
        host: { socketId },
      },
    });
    return rooms;
  }

  async removeUserFromAllRooms(socketId: string): Promise<void> {
    await this.prisma.userInRoom.deleteMany({
      where: {
        user: {
          socketId,
        },
      },
    });
  }

  async removeUserFromRoom(socketId: string, roomName: string): Promise<void> {
    await this.prisma.userInRoom.deleteMany({
      where: {
        user: {
          socketId,
        },
        room: {
          name: roomName,
        },
      },
    });
    const usersInRoomCount = await this.prisma.userInRoom.count({
      where: {
        room: { name: roomName },
      },
    });
    if (usersInRoomCount === 0) {
      this.removeRoom(roomName);
    }
  }

  async getRooms(): Promise<Room[]> {
    return await this.prisma.room.findMany();
  }
}
