import { markdownToHtml, type ClubsI18nParts } from '@devprotocol/clubs-core'

export const Strings = {
	All: {
		en: 'All',
		ja: 'すべてのアイテム',
	},
	'Digital Card': {
		en: 'Sticker',
		ja: 'ステッカー',
	},
	'Short Clip': {
		en: 'Animated Sticker',
		ja: '動くステッカー',
	},
	'Short Voice': {
		en: 'Sound Sticker',
		ja: 'しゃべるステッカー',
	},
	Video: {
		en: 'Video',
		ja: '動画',
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
	CheckoutCompletedTitle: {
		en: 'Purchase completed',
		ja: '購入が完了しました',
	},
	CheckoutCompletedMessage: {
		en: 'Thank you for your purchase. The process has been completed.',
		ja: 'ご購入ありがとうございます。処理が完了しました。',
	},
	OrderID: {
		en: 'Order ID',
		ja: '注文ID',
	},
	Close: {
		en: 'Close',
		ja: '閉じる',
	},
	AllProducts: {
		en: `All Products`,
		ja: `すべてのアイテム`,
	},
	NotForSale: {
		en: 'Not for Sale',
		ja: '非売品',
	},
	ProceedToCheckout: {
		en: 'Proceed to checkout',
		ja: 'カートを見る',
	},
} satisfies ClubsI18nParts
