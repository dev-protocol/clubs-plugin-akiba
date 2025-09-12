import type {
	ClubsI18nLocale,
	ClubsOffering,
	Membership,
} from '@devprotocol/clubs-core'
import type {
	CheckoutItemPassportOffering,
	PassportItemDocument,
} from '@devprotocol/clubs-plugin-passports'

export type HomeConfig = {
	hero: {
		image: string
		color: string
		text?: {
			ja: string
			en: string
		}
	}
	features: {
		image: string
		color: string
		title: {
			ja: string
			en: string
		}
		description: {
			ja: string
			en: string
		}
		link?:
			| string
			| {
					ja: string
					en: string
			  }
	}[]
	body: string
	description: string
}

export type GlobalConfig = {
	bg?: string
	backgroundGradient?: [string, string]
	ink?: string
	logo: string
	copyright?: string
}

export type ProductsConfig = {
	productBg?: string
}

export type CategoriesConfig = ReadonlyArray<{
	readonly label: ClubsI18nLocale
	readonly payloads: ReadonlyArray<ClubsOffering['payload']>
}>

export type Override = Readonly<{
	id: string
	importFrom: string
	key: string
	payload: string | Uint8Array
	price: {
		yen: number
	}
}>

export type ComposedItem = Override & { source: Membership }

export type PassportItemData = ClubsOffering<Membership> & {
	passportItem: PassportItemDocument
} & Discount

export type ClipCategory = 'All' | 'Skin' | 'Clip' | 'BGM' | 'Video' | 'Unknown'

type Discount = {
	discount?: {
		start: number
		end: number
		price: {
			yen: number
			MATIC: number
		}
	}
}

export type Product = { id: string; product: CheckoutItemPassportOffering }
