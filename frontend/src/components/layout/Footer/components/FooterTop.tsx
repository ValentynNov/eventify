import Logo from '@/components/core/Logo'
import { FooterData } from '../data/FooterData'
import { FooterSection } from './FooterSection'
import { Socials } from './Socials'

export const FooterTop = () => (
	<div className='flex flex-col justify-between gap-5 py-10 lg:flex-row'>
		<div className='flex flex-col gap-3 w-70'>
			<Logo iconSize={40} />
			<p className='text-gray-500'>
				Платформа для пошуку, організації та участі в найкращих подіях.
				Знаходьте події, що надихають
			</p>
		</div>
		<div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
			{FooterData.map(section => (
				<FooterSection
					key={section.name}
					footerData={section}
				/>
			))}
			<Socials />
		</div>
	</div>
)
