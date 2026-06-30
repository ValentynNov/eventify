import type { Metadata } from 'next'

import { DocumentPage } from '@/features/legal/DocumentPage'

export const metadata: Metadata = {
	title: 'Політика конфіденційності'
}

const PrivacyPage = () => (
	<DocumentPage
		title='Політика конфіденційності'
		lead='Останнє оновлення: 11 травня 2026 р. Цей документ описує, які дані обробляє Eventify і з якою метою.'
	>
		<section className='space-y-3'>
			<h2 className='text-lg font-semibold text-gray-900'>Які дані ми збираємо</h2>
			<p>
				Для роботи облікового запису та реєстрацій на події ми можемо обробляти
				ім&apos;я користувача, електронну пошту, технічні журнали (IP, тип
				браузера, час запиту) та дані, які ви самі вводите у формах платформи.
			</p>
		</section>
		<section className='space-y-3'>
			<h2 className='text-lg font-semibold text-gray-900'>Мета обробки</h2>
			<p>
				Дані використовуються для надання доступу до сервісу, ідентифікації
				користувача, відображення ваших реєстрацій і зв&apos;язку з підтримкою.
				Ми не продаємо персональні дані третім сторонам.
			</p>
		</section>
		<section className='space-y-3'>
			<h2 className='text-lg font-semibold text-gray-900'>Зберігання та безпека</h2>
			<p>
				Ми застосовуємо розумні організаційні та технічні заходи для захисту
				інформації. Термін зберігання залежить від необхідності надання сервісу
				та вимог чинного законодавства України.
			</p>
		</section>
		<section className='space-y-3'>
			<h2 className='text-lg font-semibold text-gray-900'>Ваші права</h2>
			<p>
				Ви можете звернутися до нас щодо доступу, виправлення або видалення
				персональних даних через{' '}
				<a
					className='font-medium text-purple-700 underline decoration-purple-200 underline-offset-2 hover:text-purple-800'
					href='mailto:support@eventify.ua'
				>
					support@eventify.ua
				</a>
				. Цей текст є спрощеним описом для демонстраційного проєкту; для
				продакшену узгодьте формулювання з юристом.
			</p>
		</section>
	</DocumentPage>
)

export default PrivacyPage
