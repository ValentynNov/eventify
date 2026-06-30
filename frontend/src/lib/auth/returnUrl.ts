export const isSafeReturnUrl = (url: string | null | undefined): url is string =>
	Boolean(
		url &&
			url.startsWith('/') &&
			!url.startsWith('//') &&
			!url.startsWith('/\\') &&
			!url.includes('\\')
	)

export const sanitizeReturnUrl = (
	url: string | null | undefined,
	fallback: string | null = null
): string | null => (isSafeReturnUrl(url) ? url : fallback)
