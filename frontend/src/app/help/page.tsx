import type { Metadata } from 'next'

import { DocumentPage } from '@/features/legal/DocumentPage'

export const metadata: Metadata = {
	title: 'Допомога'
}

const HelpPage = () => (
	<DocumentPage
		title='Допомога'
		lead='Короткі відповіді на типові питання щодо платформи Eventify: пошук подій, реєстрація та обліковий запис.'
	>
		<section className='space-y-3'>
			<h2 className='text-lg font-semibold text-gray-900'>Як знайти подію</h2>
			<p>
				Відкрийте розділ «Події», скористайтеся пошуком за назвою або описом,
				а також фільтрами за датою, форматом, категорією та наявністю місць.
				Стан фільтрів зберігається в адресі сторінки — можна поділитися
				посиланням або оновити вкладку без втрати параметрів.
			</p>
		</section>
		<section className='space-y-3'>
			<h2 className='text-lg font-semibold text-gray-900'>Реєстрація на подію</h2>
			<p>
				На сторінці події натисніть «Зареєструватися». Для подачі заявки
				потрібно увійти в обліковий запис. Після цього ви побачите статус
				заявки у розділі «Мої реєстрації».
			</p>
		</section>
		<section className='space-y-3'>
			<h2 className='text-lg font-semibold text-gray-900'>Підтримка</h2>
			<p>
				Якщо щось не працює, напишіть на{' '}
				<a
					className='font-medium text-purple-700 underline decoration-purple-200 underline-offset-2 hover:text-purple-800'
					href='mailto:support@eventify.ua'
				>
					support@eventify.ua
				</a>
				. Ми відповімо протягом робочого дня.
			</p>
		</section>
	</DocumentPage>
)

export default HelpPage
