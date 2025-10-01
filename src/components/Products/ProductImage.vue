<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ProductsConfig } from '../../types.ts'
import type { CheckoutItemPassportOffering } from '@devprotocol/clubs-plugin-passports'
import { Media } from '@devprotocol/clubs-plugin-passports/vue'
import Bg from '../../assets/bg_sticker.png'
import { SKIN } from '../../utils/filtering-clips.ts'

type Props = {
	langs: string[]
	productsConfig?: ProductsConfig
	product: CheckoutItemPassportOffering
}

const { langs: _langs, productsConfig, product } = defineProps<Props>()

const langs = ref(_langs)

const bgImage = ref(`url(${productsConfig?.productBg ?? Bg.src})`)
const isSkin = computed(() =>
	SKIN.includes(product.props.passportItem.itemAssetType),
)
const gridWidth = computed(() => {
	return (product.props.passportItem.appearance?.grid?.w ?? 1) * 2
})
const gridHeight = computed(() => {
	return (product.props.passportItem.appearance?.grid?.h ?? 1) * 2
})
const itemOffering = computed(() => ({
	...product.props.offering,
	...product.props.passportItem,
}))
const hasBundle = computed(
	() => (product.props.offering.bundle ?? []).length > 0,
)

onMounted(() => {
	langs.value = [...navigator.languages]
})
</script>

<template>
	<div
		class="rounded"
		:class="{
			'grid grid-cols-6 grid-rows-6': !isSkin,
			'bg-center bg-repeat':
				(productsConfig?.productBgType ?? 'tile') === 'tile',
			'bg-cover bg-center': productsConfig?.productBgType === 'fill',
		}"
		:style="
			hasBundle
				? undefined
				: { '--image': bgImage, backgroundImage: 'var(--image)' }
		"
	>
		<Media
			v-if="!hasBundle"
			:item="itemOffering"
			:langs="langs"
			video-class="w-full max-w-full object-cover aspect-square"
			class="rounded drop-shadow-[0_2px_1px_rgb(0_0_0/_0.5)]"
			:class="{
				'col-span-2 col-start-3': gridWidth === 2,
				'col-span-4 col-start-2': gridWidth === 4,
				'col-span-6': gridWidth === 6,
				'row-span-2 row-start-3': gridHeight === 2,
				'row-span-4 row-start-2': gridHeight === 4,
				'row-span-6': gridHeight === 6,
			}"
		/>
		<Media
			v-else
			:item="product.props.passportItem"
			:langs="langs"
			video-class="w-full max-w-full object-cover aspect-square"
			class="col-span-6 row-span-6 rounded"
		/>
	</div>
</template>
