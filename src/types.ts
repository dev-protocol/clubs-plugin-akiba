import type {
	ClubsI18nLocale,
	ClubsOffering,
	Membership,
} from '@devprotocol/clubs-core'
import type {
	CheckoutItemPassportOffering,
	PassportItemDocument,
} from '@devprotocol/clubs-plugin-passports'

export type StringOrI18n = string | { [key: string]: string }

export type HomeConfig = {
	hero: {
		image: string
		color: string
		text?: {
			ja: string
			en: string
		}
		logo?: StringOrI18n
	}
	features: {
		image: StringOrI18n
		title?: {
			ja: string
			en: string
		}
		description?: {
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
	logo: StringOrI18n
	copyright?: string
	marquee?: {
		en: string[]
		ja: string[]
	}
}

export type ProductsConfig = {
	productBg?: string
	productBgType?: 'tile' | 'fill'
}

export type CategoriesConfig = ReadonlyArray<{
	readonly as: PassportItemAssetCategory | string
	readonly label?: ClubsI18nLocale
	readonly payloads?: ReadonlyArray<ClubsOffering['payload']>
	readonly banner?: string | ClubsI18nLocale
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

export type PassportItemAssetCategory =
	| 'Skin'
	| 'Sticker'
	| 'Animated Sticker'
	| 'Sound Sticker'
	| 'BGM'
	| 'Video'
	| 'Set'
	| 'Unknown'

export type ClipCategory = 'All' | PassportItemAssetCategory

export type ExchangerateRateAPIResponse = {
	conversion_rates: {
		USD: number
		JPY: number
	}
}
