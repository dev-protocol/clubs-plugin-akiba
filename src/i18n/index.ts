import type { ClubsI18nParts } from '@devprotocol/clubs-core'

export const Strings = {
	All: {
		en: 'All',
		ja: 'すべてのアイテム',
	},
	Clip: {
		en: 'Clip',
		ja: 'クリップ',
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
} satisfies ClubsI18nParts
