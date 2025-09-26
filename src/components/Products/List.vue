<script setup lang="ts">
import { computed, defineProps, onMounted, ref } from 'vue'
import Bg from '../../assets/bg_sticker.png'

import Clip from '../Clips/Clip.vue'
import type {
	CategoriesConfig,
	PassportItemAssetCategory,
	Product,
} from '../../types.ts'
import { toProductsMap } from '../../utils/products.ts'
import { bytes32Hex, i18nFactory } from '@devprotocol/clubs-core'
import { whenDefined } from '@devprotocol/util-ts'
import { Strings } from '../../i18n/index.ts'

type Props = {
	langs: string[]
	products: Product[]
	hideHiddenItems?: boolean
	categories?: CategoriesConfig
	base: string
}

const {
	products,
	hideHiddenItems = true,
	categories,
	langs: _langs,
} = defineProps<Props>()

const langs = ref(_langs || ['en'])

const i18nBase = i18nFactory(Strings)

const i18n = ref<ReturnType<typeof i18nBase>>(i18nBase(['en']))

const items = computed(() => {
	return Object.entries(
		toProductsMap(
			products.filter(
				({
					product: {
						props: {
							offering: { hidden },
						},
					},
				}) => (hideHiddenItems ? hidden !== true : true),
			),
			categories,
		),
	).map(([tag, prods]) => {
		const category = categories?.find((c) => {
			const key = c.as
			return key === tag
		})
		return { tag, category, prods }
	})
})

const bundledProducts = (item: Product) =>
	item.product.props.offering.bundle
		?.map((payload) =>
			products.find(
				(p) => bytes32Hex(p.product.payload) === bytes32Hex(payload),
			),
		)
		.filter((p): p is Product => p !== undefined)

const groupedProducts = (item: Product) =>
	whenDefined(item.product.props.offering.groupOf, (groupOf) =>
		products.filter((p) => p.product.props.offering.groupOf === groupOf),
	)

onMounted(() => {
	i18n.value = i18nBase(navigator.languages)
	langs.value = [...navigator.languages]
})
</script>

<template>
	<span class="@container/akiba-list">
		<section>
			<template v-for="{ tag, category, prods } in items">
				<div
					class="my-2 rounded-xl bg-neutral-100 px-2 py-1 text-sm text-neutral-500"
				>
					{{
						whenDefined(category?.label, (l) =>
							i18nFactory({ l })(langs)('l'),
						) ?? i18n(tag as PassportItemAssetCategory)
					}}
				</div>
				<img
					v-if="category?.banner"
					:src="
						typeof category.banner === 'string'
							? category.banner
							: i18nFactory({ i: category.banner })(langs)('i')
					"
					class="mb-4 h-auto w-full max-w-full rounded-xl"
				/>
				<div
					class="grid grid-cols-2 justify-between gap-4 @2xl/akiba-list:grid-cols-3 @5xl/akiba-list:grid-cols-5"
				>
					<Clip
						v-for="item in prods"
						:key="item.id"
						:composedItem="item.product"
						:bundledProducts="bundledProducts(item)"
						:groupedProducts="groupedProducts(item)"
						:displayShortDescription="true"
						:imageBackground="Bg.src"
						:langs="langs"
						:base="base"
					/>
				</div>
			</template>
		</section>
	</span>
</template>
