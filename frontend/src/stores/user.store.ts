import { User } from '@/interfaces/chat.interfaces'
import { create } from 'zustand'

export const useUserStore = create<UserStore>(set => ({
	user: null,
	setUser: user => set({ user }),
}))
type UserStore = {
	user: User | null
	setUser: (user: User) => void
}
