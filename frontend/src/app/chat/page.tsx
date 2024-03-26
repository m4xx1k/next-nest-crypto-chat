'use client'
import { Input } from '@/components/uikit/input'
import { Message, Room } from '@/interfaces/chat.interfaces'
import { api } from '@/lib/api'
import { socket } from '@/lib/socket'
import { useChatStore } from '@/stores/chat.store'
import { useUserStore } from '@/stores/user.store'
import { useRouter } from 'next/navigation'
import { Fragment, useEffect, useState } from 'react'

function Chat() {
	const user = useUserStore(state => state.user)

	const { roomName, messages, addMessage } = useChatStore()

	const [room, setRoom] = useState<Room | null>(null)
	useEffect(
		() => {
			if (roomName) {
				api(`/room/get-room-by-name/${roomName}`)
					.then(res => setRoom(res.data))
					.catch(e => {
						console.error(e)
						router.replace('/join')
					})
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[roomName]
	)

	const [text, setText] = useState('')
	const router = useRouter()

	useEffect(() => {
		if (!user || !roomName) {
			router.replace('/join')
		} else {
			socket.on('chat', message => {
				addMessage(message as Message)
			})

			socket.connect()
		}
		return () => {
			socket.off('connect')
			socket.off('disconnect')
			socket.off('chat')
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const sendMessage = (e: React.FormEvent) => {
		e.preventDefault()
		const socketId = socket.id
		if (user && socket && roomName && socketId) {
			const timeSent = new Date(Date.now()).toLocaleString('en-US')
			const payload = {
				user: {
					...user,
					socketId,
				},
				timeSent,
				text,
				roomName,
			}
			socket.emit('chat', payload)
			setText('')
		}
	}
	if (!user || !room) return null
	return (
		<main className='max-w-2xl h-screen mx-auto flex flex-col items-center justify-center'>
			<h1 className='w-full text-3xl font-bold'>Hello, ✨{user.userName}✨</h1>
			<ul className='h-96 mt-4 overflow-y-scroll w-full flex flex-col gap-1'>
				{messages.map(message => (
					<Fragment key={message.text}>
						<li className='w-full'>
							<div className='flex gap-1 items-center'>
								<h4 className='text-xl underline decoration-blue-500'>
									{message.user.userName}
								</h4>
								<span className='text-sm'>{message.timeSent}</span>
							</div>

							<p className='pl-2'>{message.text}</p>
						</li>
						{message.txids?.map((txid, i) => (
							<li key={txid.from + i} className='w-full'>
								<div className='flex flex-col gap-1 mx-auto w-fit py-2 px-4 border border-zinc-800 rounded text-sm'>
									<h3 className='underline decoration-blue-600'>{txid.id}</h3>
									<div className='flex gap-1 items-center'>
										<span className='w-16'>From:</span>
										<h4>{txid.from}</h4>
									</div>
									<div className='flex gap-1 items-center'>
										<span className='w-16'>To:</span>
										<h4>{txid.to}</h4>
									</div>

									<div className='flex gap-1 items-center'>
										<span className='w-16'>Amount:</span>
										<h4>{txid.amount}</h4>
									</div>
									<div className='flex gap-1 items-center'>
										<span className='w-16'>Date:</span>
										<h4>{txid.date}</h4>
									</div>
								</div>
							</li>
						))}
					</Fragment>
				))}
			</ul>
			<form className='w-full flex gap-1 items-center' onSubmit={sendMessage}>
				<Input
					className='h-10'
					value={text}
					onChange={e => setText(e.target.value)}
					placeholder='Enter Message'
				/>
				<button
					className='btn block text-xl font-semibold tracking-wider h-full'
					type='submit'
				>
					⤴️
				</button>
			</form>
		</main>
	)
}

export default Chat
