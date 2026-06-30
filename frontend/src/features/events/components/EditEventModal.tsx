'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/core/Input/Input'
import { Modal } from '@/components/core/Modal/Modal'
import { Select } from '@/components/core/Select/Select'
import { PrimaryButton } from '@/components/core/Button/PrimaryButton'
import { SecondaryButton } from '@/components/core/Button/SecondaryButton'
import {
	EVENT_CATEGORY_OPTIONS,
	EVENT_FORMAT_OPTIONS
} from '@/features/events/constants/eventTaxonomy'
import {
	createEventFormSchema,
	type CreateEventFormValues
} from '@/features/events/schemas/createEventForm'
import { toDatetimeLocalValue } from '@/lib/datetime'
import { extractApiMessage } from '@/lib/apiError'
import { useUpdateEvent } from '@/queries/useUpdateEvent'
import type { EventDto } from '@/types/api'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

type Props = {
	isOpen: boolean
	event: EventDto | null
	onClose: () => void
}

const mapEventToForm = (ev: EventDto): CreateEventFormValues => ({
	title: ev.title,
	description: ev.description,
	dateLocal: toDatetimeLocalValue(ev.date),
	location: ev.location,
	capacity: ev.capacity,
	category: EVENT_CATEGORY_OPTIONS.some(o => o.value === ev.category)
		? (ev.category as CreateEventFormValues['category'])
		: 'meetup',
	format: EVENT_FORMAT_OPTIONS.some(o => o.value === ev.format)
		? (ev.format as CreateEventFormValues['format'])
		: 'offline'
})

export const EditEventModal = ({ isOpen, event, onClose }: Props) => {
	const mutation = useUpdateEvent()

	const form = useForm<CreateEventFormValues>({
		resolver: zodResolver(createEventFormSchema),
		defaultValues: {
			title: '',
			description: '',
			dateLocal: '',
			location: '',
			capacity: 50,
			category: 'meetup',
			format: 'offline'
		},
		mode: 'onBlur'
	})

	useEffect(() => {
		if (!isOpen || !event) return
		form.reset(mapEventToForm(event))
		mutation.reset()
	}, [isOpen, event?.id])

	const onSubmit = form.handleSubmit(async values => {
		if (!event) return
		const d = new Date(values.dateLocal)
		if (Number.isNaN(d.getTime())) {
			form.setError('dateLocal', { message: 'Некоректна дата' })
			return
		}
		try {
			await mutation.mutateAsync({
				id: event.id,
				payload: {
					title: values.title.trim(),
					description: values.description.trim(),
					date: d.toISOString(),
					location: values.location.trim(),
					capacity: values.capacity,
					category: values.category,
					format: values.format
				}
			})
			onClose()
		} catch {}
	})

	if (!event) return null

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title='Редагувати захід'
			hideActionButton
			className='w-full max-w-lg'
			dialogContentClassName='max-md:max-h-[92dvh]'
			footer={
				<>
					<SecondaryButton
						type='button'
						onClick={onClose}
					>
						Скасувати
					</SecondaryButton>
					<PrimaryButton
						type='submit'
						form='edit-event-form'
						disabled={mutation.isPending}
						isLoading={mutation.isPending}
						loadingText='Збереження…'
					>
						Зберегти зміни
					</PrimaryButton>
				</>
			}
		>
			<form
				id='edit-event-form'
				className='space-y-4'
				noValidate
				onSubmit={onSubmit}
			>
				<div>
					<label
						htmlFor='ee-title'
						className='mb-1.5 block text-sm font-medium text-gray-900'
					>
						Назва
					</label>
					<Input
						id='ee-title'
						error={form.formState.errors.title?.message}
						{...form.register('title')}
					/>
				</div>
				<div>
					<label
						htmlFor='ee-desc'
						className='mb-1.5 block text-sm font-medium text-gray-900'
					>
						Опис
					</label>
					<textarea
						id='ee-desc'
						rows={4}
						className='w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-100'
						{...form.register('description')}
					/>
					{form.formState.errors.description?.message ? (
						<p className='mt-1 text-sm text-red-500'>
							{form.formState.errors.description.message}
						</p>
					) : null}
				</div>
				<div>
					<label
						htmlFor='ee-date'
						className='mb-1.5 block text-sm font-medium text-gray-900'
					>
						Дата й час
					</label>
					<Input
						id='ee-date'
						type='datetime-local'
						error={form.formState.errors.dateLocal?.message}
						{...form.register('dateLocal')}
					/>
				</div>
				<div>
					<label
						htmlFor='ee-loc'
						className='mb-1.5 block text-sm font-medium text-gray-900'
					>
						Локація
					</label>
					<Input
						id='ee-loc'
						error={form.formState.errors.location?.message}
						{...form.register('location')}
					/>
				</div>
				<div>
					<label
						htmlFor='ee-cap'
						className='mb-1.5 block text-sm font-medium text-gray-900'
					>
						Місткість
					</label>
					<Input
						id='ee-cap'
						type='number'
						min={1}
						error={form.formState.errors.capacity?.message}
						{...form.register('capacity', { valueAsNumber: true })}
					/>
				</div>

				<div className='grid gap-4 sm:grid-cols-2'>
					<Select
						id='ee-category'
						label='Категорія'
						allowEmpty={false}
						value={form.watch('category')}
						onChange={e =>
							form.setValue(
								'category',
								e.target.value as CreateEventFormValues['category']
							)
						}
						options={EVENT_CATEGORY_OPTIONS}
					/>
					<Select
						id='ee-format'
						label='Формат'
						allowEmpty={false}
						value={form.watch('format')}
						onChange={e =>
							form.setValue(
								'format',
								e.target.value as CreateEventFormValues['format']
							)
						}
						options={EVENT_FORMAT_OPTIONS}
					/>
				</div>

				{mutation.isError ? (
					<p className='rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600'>
						{extractApiMessage(
							mutation.error,
							'Не вдалося оновити подію. Перевірте дані або права доступу.'
						)}
					</p>
				) : null}
			</form>
		</Modal>
	)
}
