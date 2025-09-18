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
	<!-- content -->
	<div
		class="relative grid grid-cols-1 gap-4 md:grid-cols-[172px_1fr] md:gap-9"
	>
		<Gallery
			:features="homeConfig.features"
			:langs="langs"
			class="md:col-start-2"
		/>

		<span
			class="sticky top-0 z-20 md:top-2 md:col-start-1 md:row-span-2 md:row-start-1 md:self-start"
		>
			<FilteringMenu
				class="-mx-2 flex whitespace-nowrap"
				:items="products"
				:langs="langs"
				:categories="categories"
				@selected-category="
					(category) => {
						selectedCategory = category
					}
				"
			/>
		</span>

		<List
			:products="filteredItems"
			:langs="langs"
			:categories="categories"
			:base="base"
		/>
	</div>
</template>
