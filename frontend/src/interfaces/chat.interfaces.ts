export interface User {
	userName: string
	socketId: string
}

export interface Room {
	name: string
	host: User
	users: User[]
}

export interface Message {
	user: User
	timeSent: string
	text: string
	roomName: string
	txids?: TXID[]
}
export interface TXID {
	id: string
	from: string
	to: string
	date: string
	amount: string
}
export interface ServerToClientEvents {
	chat: (e: Message) => void
}

export interface ClientToServerEvents {
	chat: (e: Message) => void
	join_room: (e: { user: User; roomName: string }) => void
}
