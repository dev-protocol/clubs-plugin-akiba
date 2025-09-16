<script setup lang="ts">
import { computed, defineProps, onMounted, ref, useTemplateRef } from 'vue'
import Bg from '../../assets/bg_sticker.png'

import Clip from '../Clips/Clip.vue'
import type { Product } from '../../types.ts'

type Props = {
	langs: string[]
	products: Product[]
	excludeLinkWhenNotAvailable?: boolean
	base: string
}

const { products, excludeLinkWhenNotAvailable } = defineProps<Props>()
</script>

<template>
	<span class="@container/akiba-list">
		<section
			ref="grid"
			class="grid grid-cols-2 justify-between gap-4 @2xl/akiba-list:grid-cols-3 @5xl/akiba-list:grid-cols-5"
		>
			<Clip
				v-for="item in products"
				:key="item.id"
				:composedItem="item.product"
				:displayShortDescription="true"
				:imageBackground="Bg.src"
				:excludeLinkWhenNotAvailable="excludeLinkWhenNotAvailable"
				:base="base"
			/>
		</section>
	</span>
</template>
