<script setup lang="ts">
import { computed, defineProps, onMounted, ref, useTemplateRef } from 'vue'

import Clip from '../Clips/Clip.vue'
import type { Product } from '../../types.ts'

type Props = {
	langs: string[]
	products: Product[]
}

const { products } = defineProps<Props>()

const grid = useTemplateRef('grid')
const cols = ref<2 | 3 | 4>(3)
const colItems = computed(() => {
	const __ = new Set<string>()
	const items = products.filter((item) => {
		// Filter duplicates
		const group = item.product.props.offering.groupOf
		return group ? (__.has(group) ? false : __.add(group)) : true
	})
	const columns = cols.value

	// 共通ロジックを抽出した関数
	const matchesColumnRule = (
		itemIndex: number,
		offset: number,
		mod: number,
	) => {
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
	<section
		ref="grid"
		class="grid justify-between gap-4"
		:class="{
			'grid-cols-4': cols === 4,
			'grid-cols-3': cols === 3,
			'grid-cols-2': cols === 2,
		}"
	>
		<div v-for="(items, i) in colItems" :index="i" class="flex flex-col gap-4">
			<Clip v-for="item in items" :key="item.id" :composedItem="item.product" />
		</div>
	</section>
</template>
