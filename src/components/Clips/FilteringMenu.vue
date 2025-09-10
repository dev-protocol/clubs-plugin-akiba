<script setup lang="ts">
import { defineProps, onMounted, ref } from 'vue'
import type {
	CheckoutFromPassportOffering,
	ComposedCheckoutOptions,
} from '@devprotocol/clubs-plugin-passports'

import { ClipCategory } from '../../types.ts'
import {
	getTagName,
	PassportItemAssetCategory,
} from '../../utils/filtering-clips.ts'
import { i18nFactory } from '@devprotocol/clubs-core'
import { Strings } from '../../i18n/index.ts'

type Props = {
	items: CheckoutFromPassportOffering
}

const { items } = defineProps<Props>()

const groupedItems = items.reduce(
	(acc, item) => {
		const itemAssetType = item.props.passportItem.itemAssetType
		const key = getTagName(itemAssetType)

		if (!acc[key]) {
			acc[key] = []
		}
		acc[key].push(item)
		return acc
	},
	{} as {
		[key: string]: { payload: string; props: ComposedCheckoutOptions }[]
	},
)

const selectedCategory = ref<ClipCategory>('All')

const i18nBase = i18nFactory(Strings)
const i18n = ref<ReturnType<typeof i18nBase>>(i18nBase(['en']))
onMounted(() => {
	i18n.value = i18nBase(navigator.languages)
})
</script>

<template>
	<ul
		class="sticky top-0 z-20 flex flex-row gap-4 overflow-x-auto bg-white p-2 md:top-2 md:flex-col md:overflow-visible md:p-0"
	>
		<li>
			<button
				type="button"
				class="w-full rounded-lg bg-gray-800 px-4 py-2 text-sm font-bold text-white hover:bg-gray-900 md:p-4"
				:class="{
					'border-gray-800 ring-2 ring-gray-800 ring-offset-2 ring-offset-white':
						selectedCategory === 'All',
				}"
				@click="
					() => {
						selectedCategory = 'All'
						$emit('selectedCategory', 'All')
					}
				"
			>
				{{ i18n('All') }}
			</button>
		</li>
		<li v-for="[category, _] of Object.entries(groupedItems)">
			<button
				type="button"
				class="flex w-full items-center justify-between gap-1 rounded-lg bg-gray-800 px-4 py-2 text-sm font-bold text-white hover:bg-gray-900 md:p-4"
				:class="{
					'border-gray-800 ring-2 ring-gray-800 ring-offset-2 ring-offset-white':
						selectedCategory === category,
				}"
				@click="
					() => {
						selectedCategory = category as ClipCategory
						$emit('selectedCategory', category)
					}
				"
			>
				{{ i18n(category as PassportItemAssetCategory) }}
				<span
					class="rounded-2xl bg-blue-100 px-2 py-1 text-xs font-bold text-cyan-800"
					>{{ groupedItems[category].length }}</span
				>
			</button>
		</li>
	</ul>
</template>
