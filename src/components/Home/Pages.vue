<script setup lang="ts">
import { computed, defineProps, ref, watch } from 'vue'

import Gallery from '../Gallery/Gallery.vue'
import FilteringMenu from '../Clips/FilteringMenu.vue'
import { getTagName } from '../../utils/filtering-clips.ts'
import type {
	CategoriesConfig,
	ClipCategory,
	HomeConfig,
	Product,
} from '../../types.ts'
import { bytes32Hex } from '@devprotocol/clubs-core'
import List from '../Products/List.vue'

type Props = {
	homeConfig: HomeConfig
	langs: string[]
	products: Product[]
	categories: CategoriesConfig
	base: string
}

const { homeConfig, langs, products, categories } = defineProps<Props>()

const selectedCategory = ref<ClipCategory | number>('All')
const filteredItems = ref<Product[]>([])

watch(
	selectedCategory,
	(category) => {
		const customCat =
			typeof category === 'number' ? categories[category] : undefined
		filteredItems.value = customCat
			? products.filter((item) => {
					return customCat.payloads?.some(
						(payload) =>
							bytes32Hex(payload) === bytes32Hex(item.product.payload),
					)
				})
			: products.filter((item) => {
					const key = getTagName(item.product.props)
					return category === 'All' || key === category
				})
	},
	{ immediate: true },
)
</script>

<template>
	<div
		class="relative flex grow flex-col items-start gap-4 md:flex-row md:justify-between"
	>
		<!-- filtering menu -->
		<FilteringMenu
			class="hidden md:flex md:w-[172px] md:min-w-[172px]"
			:items="products"
			:langs="langs"
			:categories="categories"
			@selected-category="
				(category) => {
					selectedCategory = category
				}
			"
		/>

		<!-- content -->
		<div class="flex w-full grow flex-col gap-9 md:w-auto">
			<Gallery :features="homeConfig.features" :langs="langs" />

			<FilteringMenu
				class="-mx-2 flex whitespace-nowrap md:hidden"
				:items="products"
				:langs="langs"
				:categories="categories"
				@selected-category="
					(category) => {
						selectedCategory = category
					}
				"
			/>

			<List
				:products="filteredItems"
				:langs="langs"
				:categories="categories"
				:base="base"
			/>
		</div>
	</div>
</template>
