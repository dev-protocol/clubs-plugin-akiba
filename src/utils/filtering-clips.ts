import type {
	ComposedCheckoutOptions,
	PassportItemAssetType,
} from '@devprotocol/clubs-plugin-passports'

const SKIN: PassportItemAssetType[] = ['css', 'stylesheet-link']
const DIGITAL_CARD: PassportItemAssetType[] = ['image', 'image-link']
const BGM: PassportItemAssetType[] = ['bgm', 'bgm-link']
const VIDEO: PassportItemAssetType[] = ['video', 'video-link']
const SHORT_CLIP: PassportItemAssetType[] = [
	'short-video',
	'short-video-link',
	'image-playable',
	'image-playable-link',
]
const SHORT_VOICE: PassportItemAssetType[] = [
	'short-video-controlled',
	'short-video-controlled-link',
]
const MEDIATYPE_IMAGE: PassportItemAssetType[] = [
	...DIGITAL_CARD,
	'image-playable',
	'image-playable-link',
]
const MEDIATYPE_VIDEO: PassportItemAssetType[] = [
	...VIDEO,
	...SHORT_VOICE,
	'short-video',
	'short-video-link',
]

export type PassportItemAssetCategory =
	| 'Skin'
	| 'Digital Card'
	| 'Short Clip'
	| 'Short Voice'
	| 'BGM'
	| 'Video'
	| 'Set'
	| 'Unknown'

export const getTagName = (
	item: ComposedCheckoutOptions,
): PassportItemAssetCategory => {
	const type = item.passportItem.itemAssetType
	return Array.isArray(item.offering.bundle) && item.offering.bundle.length > 0
		? 'Set'
		: SKIN.includes(type)
			? ('Skin' as PassportItemAssetCategory)
			: DIGITAL_CARD.includes(type)
				? ('Digital Card' as PassportItemAssetCategory)
				: SHORT_CLIP.includes(type)
					? ('Short Clip' as PassportItemAssetCategory)
					: SHORT_VOICE.includes(type)
						? ('Short Voice' as PassportItemAssetCategory)
						: BGM.includes(type)
							? ('BGM' as PassportItemAssetCategory)
							: VIDEO.includes(type)
								? ('Video' as PassportItemAssetCategory)
								: ('Unknown' as PassportItemAssetCategory)
}

export {
	SKIN,
	DIGITAL_CARD,
	SHORT_CLIP,
	SHORT_VOICE,
	BGM,
	VIDEO,
	MEDIATYPE_IMAGE,
	MEDIATYPE_VIDEO,
}
