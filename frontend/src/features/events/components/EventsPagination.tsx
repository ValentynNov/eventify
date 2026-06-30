'use client'

import { Button } from '@/components/core/Button/Button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Props = {
	page: number
	totalPages: number
	onPrev: () => void
	onNext: () => void
	isDisabled?: boolean
}

export const EventsPagination = ({
	page,
	totalPages,
	onPrev,
	onNext,
	isDisabled
}: Props) => {
	if (totalPages <= 1) return null

	return (
		<div className='mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-6'>
			<p className='text-sm text-gray-500'>
				Сторінка{' '}
				<span className='font-semibold text-gray-900'>{page}</span> із{' '}
				<span className='font-semibold text-gray-900'>{totalPages}</span>
			</p>
			<div className='flex gap-3'>
				<Button
					type='button'
					variant='secondary'
					className='px-4'
					onClick={onPrev}
					disabled={isDisabled || page <= 1}
				>
					<ChevronLeft className='h-4 w-4' aria-hidden /> Назад
				</Button>
				<Button
					type='button'
					variant='secondary'
					className='px-4'
					onClick={onNext}
					disabled={isDisabled || page >= totalPages}
				>
					Далі <ChevronRight className='h-4 w-4' aria-hidden />
				</Button>
			</div>
		</div>
	)
}
