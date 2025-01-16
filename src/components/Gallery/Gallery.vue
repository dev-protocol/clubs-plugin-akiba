<script setup lang="ts">
import { register } from 'swiper/element/bundle'
import { defineProps, onMounted, ref } from 'vue'

import 'swiper/swiper-bundle.css'
import SlideContent from './SlideContent.vue'
import type { HomeConfig } from '../../types.ts'
import type { Swiper as SwiperInstance } from 'swiper'

type Props = {
	features: HomeConfig['features']
	langs: string[]
}
const { features, langs } = defineProps<Props>()

register()

const swiperInstance = ref<SwiperInstance | null>(null)
const swiperEl = ref<HTMLElement | null>(null)
const current = ref(0)

const mounted = ref(false)

onMounted(() => {
	mounted.value = true

	if (swiperEl.value) {
		swiperInstance.value = (swiperEl.value as any).swiper as SwiperInstance
	}

	swiperEl.value?.addEventListener('swiperslidechange', (event) => {
		const customEvent = event as CustomEvent<[SwiperInstance]>
		const swiper = customEvent.detail[0]
		current.value = swiper.activeIndex
	})
})

const onClickSlideTo = (index: number) => {
	swiperInstance.value?.slideTo(index)
}
</script>

<template>
	<div>
		<swiper-container
			ref="swiperEl"
			:slides-per-view="1"
			:space-between="20"
			:navigation="false"
			:breakpoints="{
				768: {
					slidesPerView: 2,
				},
			}"
		>
			<swiper-slide v-for="(feature, index) in features" :key="index">
				<SlideContent
					:feature="feature"
					:langs="langs"
					:as-placeholder="!mounted"
				/>
			</swiper-slide>
		</swiper-container>

		<div v-if="!mounted" class="flex w-full gap-4">
			<!-- Loading placeholder -->
			<SlideContent
				v-for="(feature, index) in features.slice(0, 2)"
				:key="index"
				:feature="feature"
				:as-placeholder="true"
				:langs="langs"
				:class="[{ 'hidden md:flex': index > 0 }]"
			/>
		</div>

		<div
			v-if="features.length > 2"
			class="mt-4 w-full text-center"
			style="line-height: 0"
		>
			<div class="relative inline-flex gap-0 overflow-hidden rounded-full">
				<div
					class="absolute h-[5px] w-[50px] rounded-full bg-gray-600 transition-all"
					:style="`left: calc((100% / (${features.length} - 1)) * ${current})`"
				/>
				<div
					v-for="index in features.length - 1"
					class="h-[5px] w-[50px] bg-gray-200"
					@click="onClickSlideTo(index)"
				></div>
			</div>
		</div>
	</div>
</template>
