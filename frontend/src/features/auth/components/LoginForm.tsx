'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/core/Button/Button'
import { Input } from '@/components/core/Input/Input'
import type { LoginFormValues } from '@/features/auth/schemas/credentials'
import { loginSchema } from '@/features/auth/schemas/credentials'
import { extractApiMessage } from '@/lib/apiError'
import { useLogin } from '@/queries/useLogin'
import { useForm } from 'react-hook-form'

export type LoginFormProps = {
	onSwitchToRegister?: () => void
	onSuccess?: () => void
}

export const LoginForm = ({ onSwitchToRegister, onSuccess }: LoginFormProps) => {
	const mutation = useLogin()

	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: { email: '', password: '' },
		mode: 'onBlur'
	})

	const onSubmit = form.handleSubmit(async (values) => {
		try {
			await mutation.mutateAsync(values)
			onSuccess?.()
		} catch {
			// Error state is rendered from the mutation below.
		}
	})

	return (
		<form className='space-y-5' noValidate onSubmit={onSubmit}>
			<div>
				<label
					htmlFor='auth-email'
					className='mb-1.5 block text-sm font-medium text-gray-900'
				>
					Email
				</label>
				<Input
					id='auth-email'
					autoComplete='email'
					inputMode='email'
					type='email'
					placeholder='your@mail.com'
					error={form.formState.errors.email?.message}
					{...form.register('email')}
				/>
			</div>
			<div>
				<label
					htmlFor='auth-password'
					className='mb-1.5 block text-sm font-medium text-gray-900'
				>
					Пароль
				</label>
				<Input
					id='auth-password'
					type='password'
					autoComplete='current-password'
					placeholder='••••••••'
					error={form.formState.errors.password?.message}
					{...form.register('password')}
				/>
			</div>

			{onSwitchToRegister ? (
				<p className='text-center text-sm text-gray-600'>
					У вас немає аккаунту?{' '}
					<button
						type='button'
						onClick={onSwitchToRegister}
						className='font-semibold text-purple-600 underline-offset-2 hover:text-purple-700 hover:underline'
					>
						Зареєструватись
					</button>
				</p>
			) : null}

			{mutation.isError ? (
				<p className='rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600'>
					{extractApiMessage(
						mutation.error,
						'Не вдалося увійти. Перевірте email й пароль.'
					)}
				</p>
			) : null}

			<Button
				type='submit'
				className='w-full'
				isLoading={mutation.isPending}
				loadingText='Вхід…'
			>
				Увійти
			</Button>
		</form>
	)
}
