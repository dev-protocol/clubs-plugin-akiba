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
import { CLIP, getTagName, SKIN, VIDEO } from '../../utils/filtering-clips.ts'
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
const cols = ref<2 | 3 | 5>(3)
const colItems = computed(() => {
	return [
		filteredItems.value.filter((_, index) => {
			const i = index + 1
			return cols.value === 2
				? i % 2 !== 0
				: cols.value === 3
					? i === 1 || (i !== 3 && (i - 1) % 3 === 0)
					: i === 1 || (i !== 5 && (i - 1) % 5 === 0)
		}),
		filteredItems.value.filter((_, index) => {
			const i = index + 1
			return cols.value === 2
				? i % 2 === 0
				: cols.value === 3
					? i === 2 || (i - 2) % 3 === 0
					: i === 2 || (i - 2) % 5 === 0
		}),
		cols.value >= 3
			? filteredItems.value.filter((_, index) => {
					const i = index + 1
					return cols.value === 3 ? i % 3 === 0 : i === 3 || (i - 3) % 5 === 0
				})
			: undefined,
		cols.value === 5
			? filteredItems.value.filter((_, index) => {
					const i = index + 1
					return i === 4 || (i - 4) % 5 === 0
				})
			: undefined,
		cols.value === 5
			? filteredItems.value.filter((_, index) => {
					const i = index + 1
					return i % 5 === 0
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
		cols.value = r > 4 ? 5 : r > 2 ? 3 : 2
		if (!colsUpdated.value) {
			colsUpdated.value = true
		}
	})

	observer.observe(grid.value)
})
</script>

<template>
	<div class="relative flex grow flex-col items-start gap-9 md:flex-row">
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
			class="flex w-full flex-col gap-9 md:w-[calc(100%_-_64px_-_4rem)] md:gap-16"
		>
			<Gallery :features="homeConfig.features" :langs="langs" />

			<FilteringMenu
				class="-mx-2 flex md:hidden"
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
					'grid-cols-5': cols === 5,
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
						:composedItem="item"
						:class="
							colsUpdated
								? ''
								: `relative border-0 after:absolute after:inset-0 after:z-[999] after:bg-gray-100/50 after:backdrop-blur after:content-['']`
						"
					/>
				</div>
			</section>
		</div>
	</div>
</template>
