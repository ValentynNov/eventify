const ukFull = new Intl.DateTimeFormat('uk-UA', {
	dateStyle: 'long',
	timeStyle: 'short',
	hourCycle: 'h23'
})

const ukMonthYear = new Intl.DateTimeFormat('uk-UA', {
	month: 'long',
	year: 'numeric'
})

export const formatDateTimeUtc = (iso: string): string =>
	ukFull.format(new Date(iso))

export const formatMonthYear = (isoDate: Date): string =>
	ukMonthYear.format(isoDate)

export const toDatetimeLocalValue = (iso: string): string => {
	const d = new Date(iso)
	if (Number.isNaN(d.getTime())) return ''
	const pad = (n: number) => String(n).padStart(2, '0')
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}
