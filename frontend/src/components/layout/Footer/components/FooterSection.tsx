import { type FooterSections } from '@/types/footer'
import Link from 'next/link'

const opensInNewTab = (path: string) =>
	/^https?:\/\//i.test(path) || /^mailto:/i.test(path) || /^tel:/i.test(path)

type Props = {
	footerData: FooterSections
}

export const FooterSection = ({ footerData }: Props) => (
	<div className='flex flex-col gap-2'>
		<h2 className='text-lg font-bold text-gray-900'>{footerData.name}</h2>
		<ul className='flex flex-col gap-1'>
			{footerData.sectionData.map(link => (
				<li key={`${footerData.name}-${link.path}-${link.label}`}>
					{opensInNewTab(link.path) ? (
						<a
							href={link.path}
							target='_blank'
							rel='noopener noreferrer'
							className='font-medium text-gray-500 transition-colors duration-300 hover:text-purple-600'
						>
							{link.label}
						</a>
					) : (
						<Link
							href={link.path}
							className='font-medium text-gray-500 transition-colors duration-300 hover:text-purple-600'
						>
							{link.label}
						</Link>
					)}
				</li>
			))}
		</ul>
	</div>
)
