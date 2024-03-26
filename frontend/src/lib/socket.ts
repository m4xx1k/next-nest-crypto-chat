import {
	ClientToServerEvents,
	ServerToClientEvents,
} from '@/interfaces/chat.interfaces'
import { Socket, io } from 'socket.io-client'

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
	'http://localhost:3000/',
	{
		autoConnect: false,
	}
)
