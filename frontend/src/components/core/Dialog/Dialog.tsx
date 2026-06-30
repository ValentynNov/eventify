'use client'

import { cn } from '@/lib/utils'
import { useRef, useEffect, type PropsWithChildren } from 'react'

type Props = PropsWithChildren<{
	isOpen: boolean
	onClose?: () => void
	className?: string
	contentClassName?: string
	ariaLabelledBy?: string
}>

export const Dialog = ({
	isOpen,
	onClose,
	children,
	className,
	contentClassName,
	ariaLabelledBy
}: Props) => {
	const dialogRef = useRef<HTMLDialogElement>(null)

	useEffect(() => {
		const dialog = dialogRef.current

		if (!dialog) return

		const handleClose = () => {
			onClose?.()
		}
		dialog.addEventListener('close', handleClose)

		if (isOpen) {
			if (!dialog.open) {
				dialog.showModal()
			}
		} else if (dialog.open) {
			dialog.close()
		}

		return () => {
			dialog.removeEventListener('close', handleClose)
		}
	}, [isOpen, onClose])

	useEffect(() => {
		if (!isOpen) return undefined

		const html = document.documentElement
		const body = document.body
		const prevHtmlOverflow = html.style.overflow
		const prevBodyOverflow = body.style.overflow
		const prevBodyPaddingRight = body.style.paddingRight

		const scrollbarW = window.innerWidth - html.clientWidth
		html.style.overflow = 'hidden'
		body.style.overflow = 'hidden'
		if (scrollbarW > 0) {
			body.style.paddingRight = `${scrollbarW}px`
		}

		return () => {
			html.style.overflow = prevHtmlOverflow
			body.style.overflow = prevBodyOverflow
			body.style.paddingRight = prevBodyPaddingRight
		}
	}, [isOpen])

	return (
		<dialog
			ref={dialogRef}
			aria-labelledby={ariaLabelledBy}
			className={cn('m-0 h-full max-h-full w-full max-w-full', className)}
		>
			<div
				data-lenis-prevent
				className={cn('flex max-h-full flex-col overflow-y-auto', contentClassName)}
			>
				{children}
			</div>
		</dialog>
	)
}
