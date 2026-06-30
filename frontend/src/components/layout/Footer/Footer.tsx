import { FooterBottom } from './components/FooterBottom'
import { FooterTop } from './components/FooterTop'

export const Footer = () => (
	<footer className='border-t border-gray-200 bg-white px-6 sm:px-10'>
		<FooterTop />
		<FooterBottom />
	</footer>
)
