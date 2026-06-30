import type { Metadata } from 'next'

import { DocumentPage } from '@/features/legal/DocumentPage'

export const metadata: Metadata = {
	title: 'FAQ'
}

const FaqPage = () => (
	<DocumentPage
		title='Часті запитання (FAQ)'
		lead='Швидкі відповіді без зайвої бюрократії.'
	>
		<dl className='space-y-6'>
			<div>
				<dt className='font-semibold text-gray-900'>
					Чи можна переглядати події без реєстрації?
				</dt>
				<dd className='mt-2 text-gray-700'>
					Так. Каталог і сторінки подій доступні всім відвідувачам. Обліковий
					запис потрібен лише для подачі заявки на участь.
				</dd>
			</div>
			<div>
				<dt className='font-semibold text-gray-900'>
					Чому моя заявка має статус «Очікує»?
				</dt>
				<dd className='mt-2 text-gray-700'>
					Організатор або адміністратор розглядає заявки вручну. Після
					рішення статус зміниться на «Схвалено» або «Відхилено».
				</dd>
			</div>
			<div>
				<dt className='font-semibold text-gray-900'>
					Як скинути всі фільтри в каталозі?
				</dt>
				<dd className='mt-2 text-gray-700'>
					Натисніть кнопку «Скинути» у блоці фільтрів — параметри в адресі
					очистяться, і ви побачите повний список подій з першої сторінки.
				</dd>
			</div>
			<div>
				<dt className='font-semibold text-gray-900'>Хто може створювати події?</dt>
				<dd className='mt-2 text-gray-700'>
					Створення та редагування подій доступне користувачам із відповідними
					правами (наприклад, роль адміністратора). Звичайний учасник може
					лише переглядати каталог і реєструватися.
				</dd>
			</div>
		</dl>
	</DocumentPage>
)

export default FaqPage
