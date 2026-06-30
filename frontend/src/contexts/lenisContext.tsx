'use client'

import Lenis from 'lenis'
import {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useRef,
	type ReactNode
} from 'react'

type LenisContextValue = {
	getLenis: () => Lenis | null
}

const LenisContext = createContext<LenisContextValue | null>(null)

export const LenisProvider = ({ children }: { children: ReactNode }) => {
	const lenisRef = useRef<Lenis | null>(null)

	useEffect(() => {
		const lenis = new Lenis({
			lerp: 0.14,
			smoothWheel: true,
			autoRaf: true,
			anchors: true
		})
		lenisRef.current = lenis
		return () => {
			lenis.destroy()
			lenisRef.current = null
		}
	}, [])

	const value = useMemo(
		() => ({
			getLenis: () => lenisRef.current
		}),
		[]
	)

	return <LenisContext.Provider value={value}>{children}</LenisContext.Provider>
}

export const useLenisContext = (): LenisContextValue | null =>
	useContext(LenisContext)
