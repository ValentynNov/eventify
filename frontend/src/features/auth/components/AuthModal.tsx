'use client'

import { Modal } from '@/components/core/Modal/Modal'
import { useAuthModal } from '@/contexts/authModalContext'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { RegisterForm } from '@/features/auth/components/RegisterForm'
import { sanitizeReturnUrl } from '@/lib/auth/returnUrl'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

export const AuthModal = () => {
	const router = useRouter()
	const { isOpen, close, view, returnUrl, switchToRegister, switchToLogin } =
		useAuthModal()

	const afterAuth = () => {
		const target = sanitizeReturnUrl(returnUrl, '/') ?? '/'
		close()
		router.push(target)
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={close}
			title={view === 'login' ? 'Увійти' : 'Створити акаунт'}
			hideActionButton
			className='w-full max-w-md overflow-hidden'
			dialogContentClassName='max-md:max-h-[90dvh]'
		>
			<div className='relative min-h-80'>
				<div
					key={view}
					className={cn(
						'animate-[auth-pane-in_0.28s_ease-out_both]',
						view === 'register' &&
							'animate-[auth-pane-in-alt_0.28s_ease-out_both]'
					)}
				>
					{view === 'login' ? (
						<LoginForm
							onSwitchToRegister={switchToRegister}
							onSuccess={afterAuth}
						/>
					) : (
						<RegisterForm
							onSwitchToLogin={switchToLogin}
							onSuccess={afterAuth}
						/>
					)}
				</div>
			</div>
		</Modal>
	)
}
