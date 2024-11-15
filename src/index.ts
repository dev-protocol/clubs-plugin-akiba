import type { UndefinedOr } from '@devprotocol/util-ts'
import type {
	ClubsFunctionGetLayout,
	ClubsFunctionGetPagePaths,
	ClubsFunctionThemePlugin,
	ClubsThemePluginMeta,
	ClubsNavigationLink as NavLink,
	ClubsOffering,
	Membership,
} from '@devprotocol/clubs-core'
import { bytes32Hex, ClubsPluginCategory } from '@devprotocol/clubs-core'
import { default as Layout } from './layouts/Default.astro'
import { default as Index } from './pages/index.astro'
import type { GlobalConfig, HomeConfig, PassportItemData } from './types'
import PreviewImage from './assets/preview.jpg'
import { default as Icon } from './assets/icon.svg'
import { Content as Readme } from './README.md'
import Preview1 from './assets/default-theme-1.jpg'
import Preview2 from './assets/default-theme-2.jpg'
import Preview3 from './assets/default-theme-3.jpg'
import { composeItems } from './utils/compose-items'
import passportPlugin, {
	getPassportItemFromPayload,
} from '@devprotocol/clubs-plugin-passports'

export const colorPresets = {
	Purple: {
		bg: 'rgba(131, 138, 176, 1)',
		backgroundGradient: ['rgba(204, 0, 255, 0.2)', 'rgba(204, 0, 255, 0)'],
		ink: 'rgba(255, 255, 255)',
	},
	Grey: {
		bg: 'rgba(173, 173, 173, 1)',
		ink: '#111111',
	},
	Black: {
		bg: 'rgba(29, 36, 38, 1)',
		ink: 'rgba(255, 255, 255, 1)',
	},
	Brown: {
		bg: 'rgba(68, 59, 45, 1)',
		backgroundGradient: ['rgba(255, 201, 119, 0.2)', 'rgba(255, 201, 119, 0)'],
		ink: 'rgb(252, 225, 203)',
	},
	Stone: {
		bg: 'rgba(96, 119, 124, 1)',
		backgroundGradient: ['rgba(196, 196, 196, 0.5)', 'rgba(196, 196, 196, 0)'],
		ink: 'rgba(255, 255, 255, 1)',
	},
	Matcha: {
		bg: 'rgba(63, 78, 38, 1)',
		ink: 'rgb(252, 225, 203)',
	},
	Pink: {
		bg: 'rgba(255, 187, 195, 1)',
		backgroundGradient: ['rgba(255, 173, 217, 1)', 'rgba(255, 173, 217, 0)'],
		ink: 'rgba(255, 255, 255)',
	},
	Blue: {
		bg: 'rgba(91, 139, 245, 1)',
		ink: 'rgba(255, 255, 255)',
	},
	Orange: {
		bg: 'rgba(255, 131, 83, 1)',
		backgroundGradient: ['rgba(249, 192, 82, 1)', 'rgba(249, 192, 82, 0)'],
		ink: 'rgba(255, 255, 255)',
	},
}

export type SectionOrderingValue = 'about-first' | 'memberships-first'

export type MembersCountVisibilityValue = 'hidden' | 'visible'

export const getPagePaths = (async (options, config, utils) => {
	const { name, propertyAddress, rpcUrl, chainId } = config

	const [membershipConfig] = utils.getPluginConfigById(
		'devprotocol:clubs:simple-memberships',
	)
	const allMemberships = membershipConfig?.options.find(
		(opt) => opt.key === 'memberships',
	)?.value as UndefinedOr<Membership[]>

	// Filter out deprecated memberships.
	const memberships = allMemberships?.filter(
		(membership) => !membership.deprecated,
	)

	const homeConfig = options.find((opt) => opt.key === 'homeConfig')
		?.value as UndefinedOr<HomeConfig>

	const sectionsOrderConfig =
		(
			options.find((opt) => opt.key === 'sectionsOrder') as UndefinedOr<{
				key: 'sectionsOrder'
				value: SectionOrderingValue
			}>
		)?.value ?? 'memberships-first'

	const sidebarPrimaryLinks =
		config.options?.find((option) => option.key === 'sidebarPrimaryLinks')
			?.value ?? ([] as NavLink[])

	const sidebarLinks =
		config.options?.find((option) => option.key === 'sidebarLinks')?.value ??
		([] as NavLink[])

	const avatarImgSrc = config.options?.find(
		(option) => option.key === 'avatarImgSrc',
	)?.value

	const [clubsPay] = utils.getPluginConfigById(
		'devprotocol:clubs:plugin:clubs-payments',
	)
	const clubsPaymentsOverrides = composeItems(clubsPay?.options || [], utils)

	const _passportOfferings = (
		config?.offerings ?? ([] as ClubsOffering<Membership>[])
	)?.filter((offering) => offering.managedBy === passportPlugin.meta.id)
	const passportOfferingWithItemData = await Promise.all(
		_passportOfferings?.map((offering) =>
			getPassportItemFromPayload({
				sTokenPayload: bytes32Hex(offering.payload ?? '') ?? '',
			})
				.then((item) =>
					item instanceof Error || !item
						? undefined
						: ({ ...offering, passportItem: item } as PassportItemData),
				)
				.catch(undefined),
		) ?? ([] as Array<PassportItemData | undefined>),
	)
		.then((items) => items.filter((items) => !!items))
		.then((items) => (items.length ? items : undefined))
		.catch(() => undefined)

	return homeConfig
		? [
				{
					paths: [],
					component: Index,
					props: {
						name,
						propertyAddress,
						memberships,
						homeConfig,
						rpcUrl,
						chainId,
						sidebarPrimaryLinks,
						sidebarLinks,
						avatarImgSrc,
						sectionsOrderConfig,
						clubsPaymentsOverrides,
						signals: ['connection-button-hide'],
						passportOfferings: passportOfferingWithItemData,
					},
				},
			]
		: []
}) satisfies ClubsFunctionGetPagePaths

export const getLayout = (async (options, config, { getPluginConfigById }) => {
	const [membershipConfig] = getPluginConfigById(
		'devprotocol:clubs:simple-memberships',
	)
	const memberships = membershipConfig?.options.find(
		(opt) => opt.key === 'memberships',
	)?.value as UndefinedOr<Membership[]>

	const globalConfig = options.find((opt) => opt.key === 'globalConfig')
		?.value as UndefinedOr<GlobalConfig>
	const homeConfig = options.find((opt) => opt.key === 'homeConfig')
		?.value as UndefinedOr<HomeConfig>
	const membersCountConfig: MembersCountVisibilityValue =
		(
			options.find((option) => option.key === 'membersCount') as UndefinedOr<{
				key: 'membersCount'
				value: MembersCountVisibilityValue
			}>
		)?.value ?? 'visible'
	const description = homeConfig?.description

	return {
		layout: Layout,
		props: {
			theme2: {
				config,
				homeConfig,
				globalConfig,
				membersCountConfig,
				memberships,
				description,
			},
		},
	}
}) satisfies ClubsFunctionGetLayout

export const meta = {
	id: 'devprotocol:clubs:plugin:akiba',
	displayName: 'Minimalist',
	category: ClubsPluginCategory.Theme,
	theme: {
		previewImage: PreviewImage.src,
	},
	icon: Icon.src,
	offer: {
		price: 0,
		priceCurrency: 'DEV',
	},
	description: `Basic theme with multiple color schemes.`,
	previewImages: [Preview1.src, Preview2.src, Preview3.src],
	readme: Readme,
} satisfies ClubsThemePluginMeta

export default {
	getPagePaths,
	getLayout,
	meta,
} satisfies ClubsFunctionThemePlugin
