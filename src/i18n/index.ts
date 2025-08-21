import { markdownToHtml, type ClubsI18nParts } from '@devprotocol/clubs-core'

export const Strings = {
	All: {
		en: 'All',
		ja: 'すべてのアイテム',
	},
	'Digital Card': {
		en: 'Digital Card',
		ja: 'デジタルカード',
	},
	'Short Clip': {
		en: 'Short Clip',
		ja: 'ショートクリップ',
	},
	'Short Voice': {
		en: 'Short Voice',
		ja: 'ショートボイス',
	},
	Video: {
		en: 'Video',
		ja: 'GIF・動画',
	},
	Skin: {
		en: 'Skin',
		ja: 'スキン',
	},
	BGM: {
		en: 'BGM',
		ja: 'BGM',
	},
	Unknown: {
		en: 'Uknown',
		ja: 'その他',
	},
	SelectMembership: {
		en: 'Select a membership',
		ja: 'メンバーシップを選択してください',
	},
	BecomeMember: {
		en: 'Become a member',
		ja: 'メンバーになる',
	},
	WaitForLaunch: {
		en: 'Please wait for the launch',
		ja: 'ローンチまでお待ちください',
	},
	About: {
		en: ([name]) => `About ${name}`,
		ja: ([name]) => `${name} について`,
	},
	JPY: {
		en: 'JPY',
		ja: '円',
	},
	Description: {
		en: `Description`,
		ja: `説明`,
	},
	AddToCart: {
		en: `Add to Cart`,
		ja: `カートに追加`,
	},
	Copyrights: {
		en: markdownToHtml(
			`Images, text, audio, video, and other data sold on this site are protected by copyright law.<br/>Reproduction, reprinting, distribution, or similar acts are prohibited and may be punishable by law.`,
		),
		ja: markdownToHtml(
			`当サイトで販売されている画像・テキスト・音声・動画などのデータは著作権法により保護されています。<br/>データの複製、転載、配布、それに準ずる行為は禁止されており、法律により罰せられる場合があります`,
		),
	},
	BundledProducts: {
		en: `This set includes`,
		ja: `このセットに含まれるアイテム`,
	},
	SetsIncludingThis: {
		en: `Check out the great sets that include this item`,
		ja: `お得なセットもチェック`,
	},
} satisfies ClubsI18nParts
