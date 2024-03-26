'use client'

import { HoverEffect } from '@/components/uikit/card-hover-effect'
import { Input } from '@/components/uikit/input'
import { Room } from '@/interfaces/chat.interfaces'
import { api } from '@/lib/api'
import { socket } from '@/lib/socket'
import { useChatStore } from '@/stores/chat.store'
import { useUserStore } from '@/stores/user.store'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const Page = () => {
	const { setUser } = useUserStore()
	const { roomName, selectRoomName } = useChatStore()
	const [userName, setUserName] = React.useState<string>('')
	const [rooms, setRooms] = React.useState<Room[] | null>(null)
	const router = useRouter()
	const handleJoin = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const socketId = socket.id
		if (socketId && userName && roomName) {
			const user = { userName, socketId }

			const payload = {
				roomName,
				user,
			}

			socket.emit('join_room', payload)
			setUser(user)
			router.replace('/chat')
		}
	}

	useEffect(() => {
		socket.on('connect', () => {
			console.log('connected')
		})
		socket.on('disconnect', () => {
			console.log('disconnected')
		})
		socket.connect()

		api('http://localhost:3000/room/get-all-rooms')
			.then(res => setRooms(res.data))
			.catch(console.error)

		return () => {
			socket.off('connect')
			socket.off('disconnect')
		}
	}, [])
	return (
		<main className='max-w-2xl h-screen mx-auto flex flex-col items-center justify-center'>
			<h1 className='w-full text-3xl font-bold'>Hello, {'{username}'}</h1>
			<form className='space-y-2' onSubmit={handleJoin}>
				<section className='flex gap-4 items-center'>
					<Input
						value={userName}
						onChange={e => setUserName(e.target.value)}
						placeholder='Enter Your Name'
					/>
					<h3 className='text-4xl font-bold'>AND</h3>
					<Input
						value={roomName || ''}
						onChange={e => selectRoomName(e.target.value)}
						placeholder='Enter Room Name'
					/>
				</section>

				<section>
					<h3 className='text-xl font-semibold'>Available Rooms:</h3>
					<HoverEffect
						cb={item => selectRoomName(item.title)}
						items={
							rooms?.map(room => ({
								title: room.name,
							})) ?? []
						}
					/>
				</section>

				<button
					className='w-1/2 mx-auto btn block text-xl font-semibold tracking-wider'
					type='submit'
				>
					Join 👉
				</button>
			</form>
		</main>
	)
}

export default Page
