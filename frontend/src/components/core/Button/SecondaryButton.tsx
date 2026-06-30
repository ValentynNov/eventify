import { ComponentProps } from 'react'
import { Button } from './Button'

type Props = ComponentProps<typeof Button>

export const SecondaryButton = ({ ...props }: Props) => {
	return (
		<Button
			variant='secondary'
			{...props}
		/>
	)
}
