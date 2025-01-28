<script setup lang="ts">
import {
	computed,
	defineProps,
	onMounted,
	ref,
	useTemplateRef,
	watch,
} from 'vue'
import type { CheckoutFromPassportOffering } from '@devprotocol/clubs-plugin-passports'

import Clip from '../Clips/Clip.vue'
import Gallery from '../Gallery/Gallery.vue'
import FilteringMenu from '../Clips/FilteringMenu.vue'
import {
	DIGITAL_CARD,
	getTagName,
	SKIN,
	VIDEO,
} from '../../utils/filtering-clips.ts'
import type { ClipCategory, HomeConfig, PassportItemData } from '../../types.ts'

type Props = {
	homeConfig: HomeConfig
	langs: string[]
	passportOfferingsWithComposedData: CheckoutFromPassportOffering
}

const { homeConfig, langs, passportOfferingsWithComposedData } =
	defineProps<Props>()

const selectedCategory = ref<ClipCategory>('All')
const filteredItems = ref<CheckoutFromPassportOffering>([])
const grid = useTemplateRef('grid')
const cols = ref<2 | 3 | 4>(3)
const colItems = computed(() => {
	const items = filteredItems.value
	const columns = cols.value

	// 共通ロジックを抽出した関数
	const matchesColumnRule = (itemIndex: number, offset: number, mod: number) => {
		return itemIndex === offset || (itemIndex - offset) % mod === 0
	}

	return [
		items.filter((_, index) => {
			const itemIndex = index + 1
			return columns === 2
				? itemIndex % 2 !== 0
				: matchesColumnRule(itemIndex, 1, columns === 3 ? 3 : 4)
		}),
		items.filter((_, index) => {
			const itemIndex = index + 1
			return columns === 2
				? itemIndex % 2 === 0
				: matchesColumnRule(itemIndex, 2, columns === 3 ? 3 : 4)
		}),
		columns >= 3
			? items.filter((_, index) => {
				const itemIndex = index + 1
				return columns === 3
					? itemIndex % 3 === 0
					: matchesColumnRule(itemIndex, 3, 4)
			})
			: undefined,
		columns === 4
			? items.filter((_, index) => {
				const itemIndex = index + 1
				return matchesColumnRule(itemIndex, 4, 4)
			})
			: undefined,
	]
})

const colsUpdated = ref(false)

watch(
	selectedCategory,
	(category) => {
		filteredItems.value = passportOfferingsWithComposedData.filter((item) => {
			const itemAssetType = item.props.passportItem.itemAssetType
			const key = getTagName(itemAssetType)
			return category === 'All' || key === category
		})
	},
	{ immediate: true },
)

onMounted(() => {
	if (!grid.value) return
	const observer = new ResizeObserver(([entry]) => {
		const w = entry.contentRect.width
		const r = w / 250
		cols.value = r > 3 ? 4 : r > 2 ? 3 : 2
		if (!colsUpdated.value) {
			colsUpdated.value = true
		}
	})

	observer.observe(grid.value)
})
</script>

<template>
	<div class="relative flex grow flex-col items-start gap-4 md:justify-between md:flex-row md:gap-0">
		<!-- filtering menu -->
		<FilteringMenu
			class="hidden md:flex"
			:items="passportOfferingsWithComposedData"
			@selected-category="
				(category) => {
					selectedCategory = category
				}
			"
		/>

		<!-- content -->
		<div
			class="flex w-full flex-col gap-9 md:w-[calc(100%_-_150px_-_4rem)] md:gap-16"
		>
			<Gallery :features="homeConfig.features" :langs="langs" />

			<FilteringMenu
				class="-mx-2 flex md:hidden whitespace-nowrap"
				:items="passportOfferingsWithComposedData"
				@selected-category="
					(category) => {
						selectedCategory = category
					}
				"
			/>

			<section
				ref="grid"
				class="grid justify-between gap-4"
				:class="{
					'grid-cols-4': cols === 4,
					'grid-cols-3': cols === 3,
					'grid-cols-2': cols === 2,
				}"
			>
				<div
					v-for="(items, i) in colItems"
					:index="i"
					class="flex flex-col gap-4"
				>
					<Clip
						v-for="item in items"
						:key="item.payload"
						:composedItem="item"
					/>
				</div>
			</section>
		</div>
	</div>
</template>
