import type { PassportItemAssetType } from '@devprotocol/clubs-plugin-passports'

const SKIN: PassportItemAssetType[] = ['css', 'stylesheet-link']
const CLIP: PassportItemAssetType[] = [
	'image',
	'image-link',
	'image-playable',
	'image-playable-link',
]
const BGM: PassportItemAssetType[] = ['bgm', 'bgm-link']
const VIDEO: PassportItemAssetType[] = [
	'video',
	'video-link',
	'short-video',
	'short-video-link',
	'short-video-controlled',
	'short-video-controlled-link',
]

export type PassportItemAssetCategory =
	| 'Skin'
	| 'Clip'
	| 'BGM'
	| 'Video'
	| 'Unknown'

export const getTagName = (
	tag: PassportItemAssetType,
): PassportItemAssetCategory => {
	return SKIN.includes(tag)
		? ('Skin' as PassportItemAssetCategory)
		: CLIP.includes(tag)
			? ('Clip' as PassportItemAssetCategory)
			: BGM.includes(tag)
				? ('BGM' as PassportItemAssetCategory)
				: VIDEO.includes(tag)
					? ('Video' as PassportItemAssetCategory)
					: ('Unknown' as PassportItemAssetCategory)
}

export { SKIN, CLIP, BGM, VIDEO }
