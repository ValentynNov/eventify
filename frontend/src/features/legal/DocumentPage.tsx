import type { ReactNode } from 'react'

type Props = {
	title: string
	lead?: string
	children: ReactNode
}

export const DocumentPage = ({ title, lead, children }: Props) => (
	<div className='mx-auto w-full max-w-3xl px-4 pb-16 pt-10 sm:px-6 lg:px-10'>
		<header className='space-y-3 border-b border-gray-200 pb-8'>
			<h1 className='text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl'>
				{title}
			</h1>
			{lead ? (
				<p className='text-sm leading-relaxed text-gray-600 sm:text-base'>{lead}</p>
			) : null}
		</header>
		<div className='mt-8 space-y-4 text-sm leading-relaxed text-gray-700 sm:text-base'>
			{children}
		</div>
	</div>
)
