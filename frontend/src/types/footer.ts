import { NavItem } from './navigation'
import { IconType } from 'react-icons'

export type FooterSections = {
	name: string
	sectionData: NavItem[]
}

export type Social = {
	icon: IconType
	path: string
}
