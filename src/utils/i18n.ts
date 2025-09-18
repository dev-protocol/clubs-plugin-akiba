import { i18nFactory, type ClubsI18nLocale } from '@devprotocol/clubs-core'

export const i18nWith = (langs: string[]) => (locale: ClubsI18nLocale) =>
	i18nFactory({ i: locale })(langs)('i')
