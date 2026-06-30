'use client'

import {
	useRef,
	useEffect,
	useId,
	type PropsWithChildren,
	type ReactNode
} from 'react'

import { MutedTertiaryButton } from '../Button/MutedTertiaryButton'
import { PrimaryButton } from '../Button/PrimaryButton'
import { Dialog } from '../Dialog/Dialog'
import { useMedia } from '@/lib/hooks/useMedia'
import { cn } from '@/lib/utils'
import { X, type LucideIcon } from 'lucide-react'

export type Props = PropsWithChildren<{
	isOpen: boolean
	onClose: () => void
	title?: string
	className?: string
	titleClassName?: string
	contentClassName?: string
	dialogContentClassName?: string
	dialogWrapperClassName?: string
	footerClassName?: string
	/** When set, replaces the default primary footer row. */
	footer?: ReactNode
	onCloseButtonClick?: () => void
	actionButtonText?: string
	actionButtonHandler?: () => void
	hideActionButton?: boolean
	closeIcon?: LucideIcon
	closeOnBackdropClick?: boolean
	closeButton?: ReactNode
	shouldShowSpacer?: boolean
	areInteractionsDisabled?: boolean
}>

export const Modal = ({
	isOpen,
	onClose,
	title,
	children,
	className,
	titleClassName,
	contentClassName,
	dialogContentClassName,
	dialogWrapperClassName,
	footerClassName,
	footer,
	onCloseButtonClick,
	actionButtonText = 'Зберегти',
	actionButtonHandler,
	hideActionButton = false,
	closeIcon: CloseIcon = X,
	closeOnBackdropClick = true,
	closeButton,
	shouldShowSpacer = true,
	areInteractionsDisabled = false
}: Props) => {
	const { isMobile } = useMedia()
	const titleId = useId()
	const dialogContentRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!closeOnBackdropClick || !isOpen) return

		const listener = (event: MouseEvent) => {
			const el = dialogContentRef.current
			if (
				areInteractionsDisabled ||
				!el ||
				el.contains(event.target as Node)
			) {
				return
			}
			onClose()
		}

		document.addEventListener('mousedown', listener)
		return () => {
			document.removeEventListener('mousedown', listener)
		}
	}, [closeOnBackdropClick, isOpen, onClose, areInteractionsDisabled])

	const handleCloseButtonClick = () => {
		if (onCloseButtonClick) {
			onCloseButtonClick()
		} else {
			onClose()
		}
	}

	const handleActionButtonClick = () => {
		if (actionButtonHandler) {
			actionButtonHandler()
		} else {
			onClose()
		}
	}

	return (
		<Dialog
			isOpen={isOpen}
			onClose={onClose}
			ariaLabelledBy={title ? titleId : undefined}
			contentClassName={cn('max-md:h-dvh', dialogContentClassName)}
			className={cn(
				'eventify-dialog z-50 bg-white',
				isMobile && 'mt-auto h-dvh w-screen border-t border-gray-200',
				!isMobile && 'mx-auto my-auto h-fit w-fit rounded-xl',
				className
			)}
		>
			<div
				ref={dialogContentRef}
				data-lenis-prevent
				className={cn(
					'flex h-full flex-col outline-none',
					isMobile && 'w-screen',
					dialogWrapperClassName
				)}
			>
				{title && (
					<div
						className={cn(
							'flex items-center justify-between gap-4 p-4',
							isMobile && 'border-b border-gray-200',
							titleClassName
						)}
					>
						{isMobile && shouldShowSpacer && <div className='w-8' />}
						<h2
							id={titleId}
							className={cn(
								'font-semibold',
								isMobile ? 'text-center text-lg' : 'text-xl'
							)}
						>
							{title}
						</h2>
						<MutedTertiaryButton
							type='button'
							onClick={handleCloseButtonClick}
							icon={CloseIcon}
							aria-label='Закрити'
							disabled={areInteractionsDisabled}
						/>
					</div>
				)}
				<div
					className={cn('h-full flex-1 overflow-y-auto p-4', contentClassName)}
				>
					{children}
				</div>
				{footer != null ? (
					<div
						className={cn(
							'flex flex-wrap items-center justify-end gap-3 border-t border-gray-100 p-4',
							footerClassName
						)}
					>
						{footer}
					</div>
				) : !hideActionButton ? (
					<div
						className={cn('flex items-center justify-end gap-3 p-4', footerClassName)}
					>
						<PrimaryButton
							onClick={handleActionButtonClick}
							disabled={areInteractionsDisabled}
						>
							{actionButtonText}
						</PrimaryButton>
						{closeButton}
					</div>
				) : null}
			</div>
		</Dialog>
	)
}
