'use client'
import { cn } from '@/utils/cn'
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import * as React from 'react'

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {}
const radius = 100

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, ...props }, ref) => {
		const [visible, setVisible] = React.useState(false)

		let mouseX = useMotionValue(0)
		let mouseY = useMotionValue(0)

		function handleMouseMove({ currentTarget, clientX, clientY }: any) {
			let { left, top } = currentTarget.getBoundingClientRect()

			mouseX.set(clientX - left)
			mouseY.set(clientY - top)
		}
		return (
			<motion.div
				style={{
					background: useMotionTemplate`
        radial-gradient(
          ${visible ? radius + 'px' : '0px'} circle at ${mouseX}px ${mouseY}px,
          var(--blue-500),
          transparent 80%
        )
      `,
				}}
				onMouseMove={handleMouseMove}
				onMouseEnter={() => setVisible(true)}
				onMouseLeave={() => setVisible(false)}
				className='p-[2px] rounded transition duration-300 group/input w-full'
			>
				<input
					type={type}
					className={cn(
						`flex h-16 w-full border-none bg-zinc-950 text-white shadow-input rounded-sm px-6 py-4 text-lg  file:border-0 file:bg-transparent 
          file:text-sm file:font-medium placeholder-text-neutral-600 
          focus-visible:outline-none focus-visible:ring-[2px]  focus-visible:ring-neutral-600
           disabled:cursor-not-allowed disabled:opacity-50
           shadow-[0px_0px_1px_1px_var(--neutral-700)]
           group-hover/input:shadow-none transition duration-400
           `,
						className
					)}
					ref={ref}
					{...props}
				/>
			</motion.div>
		)
	}
)
Input.displayName = 'Input'

export { Input }
