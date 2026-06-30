'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/core/Button/Button'
import { Input } from '@/components/core/Input/Input'
import type { RegisterFormValues } from '@/features/auth/schemas/credentials'
import { registerSchema } from '@/features/auth/schemas/credentials'
import { extractApiMessage } from '@/lib/apiError'
import { useRegister } from '@/queries/useRegister'
import { useForm } from 'react-hook-form'

export type RegisterFormProps = {
	onSwitchToLogin?: () => void
	onSuccess?: () => void
}

export const RegisterForm = ({
	onSwitchToLogin,
	onSuccess
}: RegisterFormProps) => {
	const mutation = useRegister()

	const form = useForm<RegisterFormValues>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			username: '',
			email: '',
			password: '',
			confirmPassword: ''
		},
		mode: 'onBlur'
	})

	const onSubmit = form.handleSubmit(async (values) => {
		try {
			await mutation.mutateAsync({
				username: values.username,
				email: values.email,
				password: values.password
			})
			onSuccess?.()
		} catch {
			// Error state is rendered from the mutation below.
		}
	})

	return (
		<form className='space-y-5' noValidate onSubmit={onSubmit}>
			<p className='rounded-xl border border-violet-100 bg-violet-50/80 px-4 py-3 text-xs leading-relaxed text-violet-900'>
				<strong className='font-semibold'>Демо для захисту:</strong> обліковий запис з
				правами адміністратора створюється автоматично, якщо email закінчується на{' '}
				<code className='rounded bg-white px-1.5 py-0.5 font-mono text-[11px] text-purple-800'>
					@admin.eventify
				</code>{' '}
				(наприклад, <span className='font-mono'>demo@admin.eventify</span>).
			</p>
			<div>
				<label
					htmlFor='auth-username'
					className='mb-1.5 block text-sm font-medium text-gray-900'
				>
					Ім’я користувача
				</label>
				<Input
					id='auth-username'
					autoComplete='username'
					placeholder='Ваш логін'
					error={form.formState.errors.username?.message}
					{...form.register('username')}
				/>
			</div>
			<div>
				<label
					htmlFor='auth-reg-email'
					className='mb-1.5 block text-sm font-medium text-gray-900'
				>
					Email
				</label>
				<Input
					id='auth-reg-email'
					type='email'
					autoComplete='email'
					inputMode='email'
					placeholder='your@mail.com'
					error={form.formState.errors.email?.message}
					{...form.register('email')}
				/>
			</div>
			<div>
				<label
					htmlFor='auth-reg-password'
					className='mb-1.5 block text-sm font-medium text-gray-900'
				>
					Пароль
				</label>
				<Input
					id='auth-reg-password'
					type='password'
					autoComplete='new-password'
					placeholder='Мінімум 8 символів'
					error={form.formState.errors.password?.message}
					{...form.register('password')}
				/>
			</div>
			<div>
				<label
					htmlFor='auth-reg-confirm'
					className='mb-1.5 block text-sm font-medium text-gray-900'
				>
					Підтвердження пароля
				</label>
				<Input
					id='auth-reg-confirm'
					type='password'
					autoComplete='new-password'
					placeholder='Повторіть пароль'
					error={form.formState.errors.confirmPassword?.message}
					{...form.register('confirmPassword')}
				/>
			</div>

			{onSwitchToLogin ? (
				<p className='text-center text-sm text-gray-600'>
					Вже є акаунт?{' '}
					<button
						type='button'
						onClick={onSwitchToLogin}
						className='font-semibold text-purple-600 underline-offset-2 hover:text-purple-700 hover:underline'
					>
						Увійти
					</button>
				</p>
			) : null}

			{mutation.isError ? (
				<p className='rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600'>
					{extractApiMessage(
						mutation.error,
						'Не вдалося створити акаунт. Спробуйте інший email.'
					)}
				</p>
			) : null}

			<Button
				type='submit'
				className='w-full'
				isLoading={mutation.isPending}
				loadingText='Створення…'
			>
				Створити акаунт
			</Button>
		</form>
	)
}
