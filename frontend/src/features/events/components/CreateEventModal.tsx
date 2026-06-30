'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/core/Input/Input'
import { Modal } from '@/components/core/Modal/Modal'
import { Select } from '@/components/core/Select/Select'
import { PrimaryButton } from '@/components/core/Button/PrimaryButton'
import { SecondaryButton } from '@/components/core/Button/SecondaryButton'
import { isAdminUser } from '@/lib/auth/isAdmin'
import { extractApiMessage } from '@/lib/apiError'
import { useAuth } from '@/contexts/authContext'
import {
	createEventFormSchema,
	type CreateEventFormValues
} from '@/features/events/schemas/createEventForm'
import {
	EVENT_CATEGORY_OPTIONS,
	EVENT_FORMAT_OPTIONS
} from '@/features/events/constants/eventTaxonomy'
import { useCreateEvent } from '@/queries/useCreateEvent'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

type Props = {
	isOpen: boolean
	onClose: () => void
}

const defaultValues: CreateEventFormValues = {
	title: '',
	description: '',
	dateLocal: '',
	location: '',
	capacity: 50,
	category: 'meetup',
	format: 'offline'
}

export const CreateEventModal = ({ isOpen, onClose }: Props) => {
	const auth = useAuth()
	const isAdmin = isAdminUser(auth.user?.role)
	const mutation = useCreateEvent()

	const today = new Date().toISOString().split('T')[0]

	const form = useForm<CreateEventFormValues>({
		resolver: zodResolver(createEventFormSchema),
		defaultValues,
		mode: 'onBlur'
	})

	useEffect(() => {
		if (!isOpen) return
		form.reset(defaultValues)
		mutation.reset()
	}, [isOpen])

	const onSubmit = form.handleSubmit(async values => {
		const d = new Date(values.dateLocal)
		if (Number.isNaN(d.getTime())) {
			form.setError('dateLocal', { message: 'Некоректна дата' })
			return
		}
		try {
			await mutation.mutateAsync({
				title: values.title.trim(),
				description: values.description.trim(),
				date: d.toISOString(),
				location: values.location.trim(),
				capacity: values.capacity,
				category: values.category,
				format: values.format
			})
			onClose()
		} catch {
			// Error state is rendered from the mutation below.
		}
	})

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title='Новий захід'
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
						form='create-event-form'
						disabled={!isAdmin || mutation.isPending}
						isLoading={mutation.isPending}
						loadingText='Збереження…'
					>
						Опублікувати
					</PrimaryButton>
				</>
			}
		>
			<form
				id='create-event-form'
				className='space-y-4'
				noValidate
				onSubmit={onSubmit}
			>
				<div>
					<label
						htmlFor='ce-title'
						className='mb-1.5 block text-sm font-medium text-gray-900'
					>
						Назва
					</label>
					<Input
						id='ce-title'
						disabled={!isAdmin}
						error={form.formState.errors.title?.message}
						{...form.register('title')}
					/>
				</div>
				<div>
					<label
						htmlFor='ce-desc'
						className='mb-1.5 block text-sm font-medium text-gray-900'
					>
						Опис
					</label>
					<textarea
						id='ce-desc'
						rows={4}
						disabled={!isAdmin}
						className='w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 disabled:opacity-50'
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
						htmlFor='ce-date'
						className='mb-1.5 block text-sm font-medium text-gray-900'
					>
						Дата й час
					</label>
					<Input
						id='ce-date'
						type='datetime-local'
						min={today}
						disabled={!isAdmin}
						error={form.formState.errors.dateLocal?.message}
						{...form.register('dateLocal')}
					/>
				</div>
				<div>
					<label
						htmlFor='ce-loc'
						className='mb-1.5 block text-sm font-medium text-gray-900'
					>
						Локація
					</label>
					<Input
						id='ce-loc'
						disabled={!isAdmin}
						error={form.formState.errors.location?.message}
						{...form.register('location')}
					/>
				</div>
				<div>
					<label
						htmlFor='ce-cap'
						className='mb-1.5 block text-sm font-medium text-gray-900'
					>
						Місткість
					</label>
					<Input
						id='ce-cap'
						type='number'
						min={1}
						disabled={!isAdmin}
						error={form.formState.errors.capacity?.message}
						{...form.register('capacity', { valueAsNumber: true })}
					/>
				</div>

				<div className='grid gap-4 sm:grid-cols-2'>
					<Select
						id='ce-category'
						label='Категорія'
						allowEmpty={false}
						disabled={!isAdmin}
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
						id='ce-format'
						label='Формат'
						allowEmpty={false}
						disabled={!isAdmin}
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

				{form.formState.errors.dateLocal && (
					<p className='text-sm text-red-600 font-medium'>
						{form.formState.errors.dateLocal.message}
					</p>
				)}

				{mutation.isError ? (
					<p className='rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600'>
						{extractApiMessage(
							mutation.error,
							'Не вдалося створити подію. Перевірте дані або права доступу.'
						)}
					</p>
				) : null}
			</form>
		</Modal>
	)
}
