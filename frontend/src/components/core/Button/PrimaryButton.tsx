import { ComponentProps } from 'react'
import { Button } from './Button'

type Props = ComponentProps<typeof Button>

export const PrimaryButton = ({ ...props }: Props) => {
	return (
		<Button
			variant='primary'
			{...props}
		/>
	)
}
