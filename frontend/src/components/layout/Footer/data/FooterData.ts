import { NAV_LINK } from '@/const/navigation'
import { type FooterSections, type Social } from '@/types/footer'
import { FaFacebookF, FaInstagram, FaTelegramPlane } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'

export const FooterData: FooterSections[] = [
	{ name: 'Навігація', sectionData: NAV_LINK },
	{
		name: 'Підтримка',
		sectionData: [
			{ label: 'Допомога', path: '/help' },
			{ label: 'FAQ', path: '/faq' },
			{ label: 'Політика конфіденційності', path: '/terms' }
		]
	},
	{
		name: "Зв'яжіться з нами",
		sectionData: [
			{ label: 'support@eventify.ua', path: 'mailto:support@eventify.ua' },
			{ label: '+380 93 123 45 67', path: 'tel:+380931234567' },
			{
				label: 'Україна, м. Київ',
				path: 'https://www.google.com/maps/place/%D0%9A%D0%B8%D0%B5%D0%B2,+02000/@50.4018702,30.2030482,67646m/data=!3m2!1e3!4b1!4m6!3m5!1s0x40d4cf4ee15a4505:0x764931d2170146fe!8m2!3d50.4503596!4d30.5245025!16zL20vMDJzbjM0?authuser=0&entry=ttu&g_ep=EgoyMDI2MDUwNi4wIKXMDSoASAFQAw%3D%3D'
			}
		]
	}
]

export const SocialItems: Social[] = [
	{ icon: FaFacebookF, path: 'https://www.facebook.com/' },
	{ icon: FaInstagram, path: 'https://www.instagram.com/_r1nozaki/?hl=ua' },
	{ icon: FaTelegramPlane, path: 'https://t.me/r1nozaki' },
	{ icon: FaXTwitter, path: 'https://x.com/r1nozaki' }
]
