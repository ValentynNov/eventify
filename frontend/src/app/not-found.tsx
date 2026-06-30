import Link from 'next/link'
import { EmptyState } from '@/components/core/EmptyState/EmptyState'
import { SearchX } from 'lucide-react'

const NotFound = () => (
	<div className='mx-auto max-w-xl px-4 py-24 sm:px-0'>
		<EmptyState
			icon={SearchX}
			title='Сторінку не знайдено'
			description='Посилання застаріло або введено неправильний шлях.'
			action={
				<Link
					className='text-sm font-semibold text-purple-600 hover:text-purple-700'
					href='/'
				>
					На головну
				</Link>
			}
		/>
	</div>
)

export default NotFound
