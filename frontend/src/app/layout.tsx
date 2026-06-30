import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Roboto } from 'next/font/google'
import './globals.css'

import { Header } from '@/components/layout/Header/Header'
import { Footer } from '@/components/layout/Footer/Footer'
import { AuthSearchParamsBridge } from '@/features/auth/components/AuthSearchParamsBridge'
import { AppProvider } from '@/providers/appProvider'

const robotoFont = Roboto({
	variable: '--font-roboto',
	subsets: ['latin']
})

export const metadata: Metadata = {
	title: {
		template: '%s · Eventify',
		default: 'Eventify · Платформа подій'
	},
	description:
		'Переглядайте події, реєстрації й аналітику у мінімалістичній Eventify.'
}

const RootLayout = ({
	children
}: Readonly<{
	children: React.ReactNode
}>) => (
	<html
		lang='uk'
		className={`${robotoFont.variable} h-full antialiased`}
	>
		<body className='flex min-h-screen flex-col bg-gray-50 text-gray-900'>
			<AppProvider>
				<Suspense fallback={null}>
					<AuthSearchParamsBridge />
				</Suspense>
				<Header />
				<main className='flex-1'>{children}</main>
				<Footer />
			</AppProvider>
		</body>
	</html>
)

export default RootLayout
