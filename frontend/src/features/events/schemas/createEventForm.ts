import { z } from 'zod'

const eventCategorySchema = z.enum([
	'conference',
	'meetup',
	'workshop',
	'webinar',
	'hackathon'
])

const eventFormatSchema = z.enum(['online', 'offline', 'hybrid'])

export const createEventFormSchema = z.object({
	title: z
		.string()
		.trim()
		.min(2, 'Мінімум 2 символи')
		.max(200, 'Занадто довга назва'),
	description: z
		.string()
		.trim()
		.min(4, 'Додайте опис')
		.max(8000, 'Опис завеликий'),
	dateLocal: z.string().min(1, 'Оберіть дату та час'),
	location: z
		.string()
		.trim()
		.min(2, 'Вкажіть локацію')
		.max(300, 'Занадто довга адреса'),
	capacity: z
		.number({ error: () => ({ message: 'Вкажіть місткість' }) })
		.int('Лише цілі числа')
		.min(1, 'Мінімум 1 місце')
		.max(100_000, 'Максимум 100 000 місць'),
	category: eventCategorySchema,
	format: eventFormatSchema
})

export type CreateEventFormValues = z.infer<typeof createEventFormSchema>
