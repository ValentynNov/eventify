import type { Metadata } from 'next'

import { EventDetailPageView } from '@/features/events/EventDetailPageView'

export const metadata: Metadata = {
	title: 'Подія'
}

type PageProps = {
	params: Promise<{ id: string }>
}

const EventDetailPage = async ({ params }: PageProps) => {
	const { id } = await params
	return <EventDetailPageView eventId={id} />
}

export default EventDetailPage
