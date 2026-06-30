import { z } from 'zod'

export const loginSchema = z.object({
	email: z.string().trim().email('Некоректний email').max(255),
	password: z.string().min(1, 'Введіть пароль').max(100)
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const registerSchema = z
	.object({
		username: z
			.string()
			.trim()
			.min(3, 'Мінімум 3 символи')
			.max(100, 'Занадто довге ім’я'),
		email: z.string().trim().email('Некоректний email').max(255),
		password: z
			.string()
			.min(8, 'Мінімум 8 символів')
			.max(100, 'Пароль завеликий'),
		confirmPassword: z.string().min(1, 'Підтвердіть пароль')
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Паролі не збігаються',
		path: ['confirmPassword']
	})

export type RegisterFormValues = z.infer<typeof registerSchema>
