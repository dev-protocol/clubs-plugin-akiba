<script setup lang="ts">
import { defineProps, onMounted, ref } from 'vue'

import {
	CategoriesConfig,
	ClipCategory,
	PassportItemAssetCategory,
	Product,
} from '../../types.ts'
import { i18nFactory } from '@devprotocol/clubs-core'
import { Strings } from '../../i18n/index.ts'
import { whenDefined } from '@devprotocol/util-ts'
import { toProductsMap } from '../../utils/products.ts'
import Type from '../Type/Type.vue'

type Props = {
	items: Product[]
	categories?: CategoriesConfig
	langs?: string[]
}

const { items, categories, langs: _langs } = defineProps<Props>()

const langs = ref(_langs || ['en'])
const groupedItems = toProductsMap(items)

const selectedCategory = ref<ClipCategory | number>('All')

const i18nBase = i18nFactory(Strings)
const i18n = ref<ReturnType<typeof i18nBase>>(i18nBase(_langs ?? ['en']))
onMounted(() => {
	i18n.value = i18nBase(navigator.languages)
	langs.value = [...navigator.languages]
})
</script>

<template>
	<ul
		class="flex flex-row items-stretch gap-4 overflow-x-auto bg-white p-2 md:flex-col md:overflow-visible md:p-0"
	>
		<li>
			<button
				type="button"
				class="h-full w-full rounded-lg bg-gray-800 px-4 py-2 text-sm font-bold text-white hover:bg-gray-900 md:p-4"
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
		<li
			v-for="(category, i) in categories"
			:key="i"
			v-if="categories"
			class="empty:hidden"
		>
			<template v-if="category.label">
				<button
					type="button"
					class="flex w-full items-center justify-between gap-1 rounded-lg bg-gray-800 px-4 py-2 text-sm font-bold text-white hover:bg-gray-900 md:p-4"
					:class="{
						'border-gray-800 ring-2 ring-gray-800 ring-offset-2 ring-offset-white':
							selectedCategory === i,
					}"
					@click="
						() => {
							selectedCategory = i
							$emit('selectedCategory', i)
						}
					"
				>
					<div class="flex flex-col items-start gap-0.5">
						{{
							whenDefined(category.label, (l) => i18nFactory({ l })(langs)('l'))
						}}
						<Type
							:langs="langs"
							:color="{ bg: 'bg-gray-600', ink: 'text-gray-200' }"
						/>
					</div>
					<span
						class="rounded-2xl bg-blue-100 px-2 py-1 text-xs font-bold text-cyan-800"
						>{{ category.payloads?.length ?? 0 }}</span
					>
				</button>
			</template>
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
				<div class="flex flex-col items-start gap-0.5">
					{{
						whenDefined(
							categories?.find(({ as }) => as === category),
							({ label }) =>
								whenDefined(label, (l) => i18nFactory({ l })(langs)('l')),
						) ?? i18n(category as PassportItemAssetCategory)
					}}
					<Type
						:langs="langs"
						:color="{ bg: 'bg-gray-600', ink: 'text-gray-200' }"
					/>
				</div>
				<span
					class="rounded-2xl bg-blue-100 px-2 py-1 text-xs font-bold text-cyan-800"
					>{{ groupedItems[category].length }}</span
				>
			</button>
		</li>
	</ul>
</template>
