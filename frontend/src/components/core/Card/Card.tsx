import { cn } from '@/lib/utils'
import {
	forwardRef,
	type ComponentPropsWithRef,
	type HTMLAttributes
} from 'react'

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
	function Card({ className, ...props }, ref) {
		return (
			<div
				ref={ref}
				className={cn(
					'rounded-xl border border-gray-200 bg-white p-6 shadow-sm',
					className
				)}
				{...props}
			/>
		)
	}
)
Card.displayName = 'Card'

export const CardHeader = forwardRef<
	HTMLDivElement,
	HTMLAttributes<HTMLDivElement>
>(function CardHeader({ className, ...props }, ref) {
	return (
		<div
			ref={ref}
			className={cn(
				'mb-4 flex flex-wrap items-start justify-between gap-2',
				className
			)}
			{...props}
		/>
	)
})
CardHeader.displayName = 'CardHeader'

export const CardTitle = forwardRef<
	HTMLHeadingElement,
	HTMLAttributes<HTMLHeadingElement>
>(function CardTitle({ className, ...props }, ref) {
	return (
		<h3
			ref={ref}
			className={cn('text-lg font-semibold text-gray-900', className)}
			{...props}
		/>
	)
})
CardTitle.displayName = 'CardTitle'

export const CardDescription = forwardRef<
	HTMLParagraphElement,
	HTMLAttributes<HTMLParagraphElement>
>(function CardDescription({ className, ...props }, ref) {
	return (
		<p
			ref={ref}
			className={cn('text-sm text-gray-500', className)}
			{...props}
		/>
	)
})
CardDescription.displayName = 'CardDescription'

export const CardContent = forwardRef<
	HTMLDivElement,
	HTMLAttributes<HTMLDivElement>
>(function CardContent({ className, ...props }, ref) {
	return <div ref={ref} className={cn('', className)} {...props} />
})
CardContent.displayName = 'CardContent'

export const CardFooter = forwardRef<
	HTMLDivElement,
	HTMLAttributes<HTMLDivElement>
>(function CardFooter({ className, ...props }, ref) {
	return (
		<div
			ref={ref}
			className={cn(
				'mt-4 flex flex-wrap items-center justify-end gap-3 border-t border-gray-100 pt-4',
				className
			)}
			{...props}
		/>
	)
})
CardFooter.displayName = 'CardFooter'

export type CardProps = ComponentPropsWithRef<typeof Card>
