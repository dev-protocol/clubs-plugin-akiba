<script setup lang="ts">
import { defineProps, ref, watch, watchEffect } from 'vue'
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
		<div class="flex flex-col gap-9 md:gap-16 w-full md:w-[calc(100%_-_64px_-_4rem)]">
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
				class="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] justify-between gap-4 md:gap-4 lg:grid-cols-5"
			>
				<Clip v-for="item in filteredItems" :composedItem="item" />
			</section>
		</div>
	</div>
</template>
