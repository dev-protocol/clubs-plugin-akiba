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

export const getTagName = (tag: PassportItemAssetType) => {
	return SKIN.includes(tag)
		? 'Skin'
		: CLIP.includes(tag)
			? 'Clip'
			: BGM.includes(tag)
				? 'BGM'
				: VIDEO.includes(tag)
					? 'Video'
					: 'Unknown'
}

export { SKIN, CLIP, BGM, VIDEO }
