import type { Metadata } from 'next'
import { HomePageView } from '@/features/home/HomePageView'

export const metadata: Metadata = {
	title: 'Головна',
	description:
		'Ключові статистики, пошук і найближчі події Eventify без зайвого шуму в інтерфейсі.'
}

const HomePage = () => <HomePageView />

export default HomePage
