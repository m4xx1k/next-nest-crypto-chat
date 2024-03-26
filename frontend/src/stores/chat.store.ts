import { Message } from '@/interfaces/chat.interfaces'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
const initialState = {
	messages: [],
	roomName: null,
}
export const useChatStore = create<State & Actions>()(
	immer(set => ({
		...initialState,
		addMessage: message => {
			set(state => {
				state.messages = [...state.messages, message]
			})
		},
		selectRoomName: roomName => {
			set(state => {
				state.roomName = roomName
			})
		},
	}))
)
type State = {
	messages: Message[]
	roomName: string | null
}

type Actions = {
	addMessage: (message: Message) => void
	selectRoomName: (roomName: string) => void
}
