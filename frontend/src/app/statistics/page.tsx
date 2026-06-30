import type { Metadata } from 'next'
import { StatisticsPageView } from '@/features/statistics/StatisticsPageView'

export const metadata: Metadata = {
	title: 'Статистика'
}

const StatisticsPage = () => (
	<div className='mx-auto w-full max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-10'>
		<StatisticsPageView />
	</div>
)

export default StatisticsPage
