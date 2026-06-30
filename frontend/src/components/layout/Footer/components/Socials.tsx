import { SocialItems } from '../data/FooterData'

export const Socials = () => {
	return (
		<div className='flex gap-3'>
			{SocialItems.map(({ icon: Icon, path }) => (
				<a
					key={path}
					href={path}
					target='_blank'
					rel='noopener noreferrer'
					className='flex h-8 w-8 items-center justify-center rounded-md bg-gray-200 text-black transition-colors duration-300 hover:bg-purple-600 hover:text-white'
				>
					<Icon size={20} />
				</a>
			))}
		</div>
	)
}
