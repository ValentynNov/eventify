'use client'

import { useLayoutEffect, useState } from 'react'

const BREAKPOINT_MD = 768
const BREAKPOINT_LG = 1024

export type UseMediaResult = {
	isMobile: boolean
	isTablet: boolean
	isDesktop: boolean
}

const defaultMedia: UseMediaResult = {
	isMobile: false,
	isTablet: false,
	isDesktop: false
}

export const useMedia = (): UseMediaResult => {
	const [media, setMedia] = useState<UseMediaResult>(defaultMedia)

	useLayoutEffect(() => {
		const mMobile = window.matchMedia(`(max-width: ${BREAKPOINT_MD - 1}px)`)
		const mTablet = window.matchMedia(
			`(min-width: ${BREAKPOINT_MD}px) and (max-width: ${BREAKPOINT_LG - 1}px)`
		)
		const mDesktop = window.matchMedia(`(min-width: ${BREAKPOINT_LG}px)`)

		const read = (): UseMediaResult => ({
			isMobile: mMobile.matches,
			isTablet: mTablet.matches,
			isDesktop: mDesktop.matches
		})

		setMedia(read())

		const onChange = () => setMedia(read())
		mMobile.addEventListener('change', onChange)
		mTablet.addEventListener('change', onChange)
		mDesktop.addEventListener('change', onChange)

		return () => {
			mMobile.removeEventListener('change', onChange)
			mTablet.removeEventListener('change', onChange)
			mDesktop.removeEventListener('change', onChange)
		}
	}, [])

	return media
}
