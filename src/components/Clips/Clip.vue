<script setup lang="ts">
import { defineProps, onMounted, ref, computed, watch } from 'vue'
import { FastAverageColor, FastAverageColorResult } from 'fast-average-color'
import type { ComposedCheckoutOptions } from '@devprotocol/clubs-plugin-passports'

import Modal from '../Home/Modal.vue'
import ModalContent from './ModalContent.vue'

import VideoFetch from './VideoFetch.vue'

import {
	BGM,
	CLIP,
	getTagName,
	SKIN,
	VIDEO,
} from '../../utils/filtering-clips.ts'

type Props = {
	composedItem: { payload: string; props: ComposedCheckoutOptions }
}

const { composedItem } = defineProps<Props>()

const isDiscountActive = ref(false)
const imageRef = ref<HTMLImageElement | null>(null)

const discountStart = computed(() => {
	return composedItem.props.discount?.start_utc
})

const discountEnd = computed(() => {
	return composedItem.props.discount?.end_utc
})

const image = computed(() => {
	return CLIP.includes(composedItem.props.passportItem.itemAssetType)
		? composedItem.props.passportItem.itemAssetValue
		: SKIN.includes(composedItem.props.passportItem.itemAssetType)
			? composedItem.props.itemImageSrc
			: composedItem.props.itemImageSrc
})

const tag = computed(() => {
	return composedItem.props.passportItem.itemAssetType
})

const video = computed(() => {
	return VIDEO.includes(composedItem.props.passportItem.itemAssetType)
		? composedItem.props.passportItem.itemAssetValue
		: undefined
})

const title = computed(() => {
	return composedItem.props.itemName
})

const description = computed(() => {
	return composedItem.props.description
})

const propertyAddress = computed(() => {
	return composedItem.props.propertyAddress
})

const price = computed(() => {
	return composedItem.props.amount // TODO: confirm this.
})

const currency = computed(() => {
	return composedItem.props.currency
})

const discountCurrency = computed(() => {
	return 'usdc'
})

const discountPrice = computed(() => {
	return composedItem.props.discount?.price?.usdc
})

const chainId = computed(() => {
	return composedItem.props.chainId
})

const rpcUrl = computed(() => {
	return composedItem.props.rpcUrl
})

if (discountStart.value && discountEnd.value) {
	const now = new Date().getTime()
	isDiscountActive.value = discountStart.value < now && now < discountEnd.value
}

// modal visibility
const modalVisible = ref(false)

// open modal
const modalOpen = () => {
	modalVisible.value = true
}

// close modal
const modalClose = () => {
	modalVisible.value = false
}

const color = ref<FastAverageColorResult>()

onMounted(async () => {
	if (SKIN.includes(tag.value)) {
		const fac = new FastAverageColor()
		color.value = await fac.getColorAsync(image.value || '').catch((e) => {
			console.error(e)
			return undefined
		})
	}
	await updateImageIfNeeded()
})
watch(image, async (newVal, oldVal) => {
	if (newVal !== oldVal) {
		await updateImageIfNeeded()
	}
})
async function updateImageIfNeeded() {
	if (image.value) {
		try {
			console.log({ image: image.value })
			const response = await fetch(image.value)
			const blob = await response.blob()
			const blobDataUrl = URL.createObjectURL(blob)
			if (imageRef.value) {
				imageRef.value.src = blobDataUrl
			}
		} catch (error) {
			console.error('Error loading video:', error)
		}
	}
}
</script>

<style scoped>
.gradation {
	position: relative;
}

.gradation::before {
	content: '';
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	background: linear-gradient(0deg, v-bind(color?.hex) 25%, transparent);
}
</style>

<template>
	<div
		class="flex aspect-[3/4] flex-col gap-4 overflow-hidden rounded border border-gray-300 p-1 shadow md:p-2"
		:class="{
			'bg-white':
				CLIP.includes(tag) || BGM.includes(tag) || VIDEO.includes(tag),
			'gradation bg-cover bg-no-repeat': SKIN.includes(tag),
		}"
		:style="{
			backgroundImage: SKIN.includes(tag) ? `url(${image})` : '',
		}"
		@click.stop="modalOpen"
	>
		<div class="relative overflow-hidden rounded">
			<img
				ref="imageRef"
				v-if="CLIP.includes(tag)"
				class="aspect-square w-full object-cover"
				alt="Clip"
			/>
			<VideoFetch
				v-if="VIDEO.includes(tag) && video"
				:videoClass="`rounded-md w-full max-w-full object-cover aspect-square pointer-events-none`"
				:url="video"
				alt="Clip"
			/>
			<div
				v-if="SKIN.includes(tag)"
				class="aspect-square w-full object-cover"
				role="presentation"
			/>
			<div
				class="absolute bottom-1 left-1 rounded px-2 py-1 text-xs text-white"
				:class="{
					'bg-indigo-600': CLIP.includes(tag),
					'bg-fuchsia-500': SKIN.includes(tag),
					'bg-orange-500': BGM.includes(tag),
					'bg-yellow-500': VIDEO.includes(tag),
				}"
			>
				{{ getTagName(tag) }}
			</div>
		</div>
		<div class="z-10 flex flex-col gap-1">
			<h3
				class="overflow-hidden text-ellipsis text-nowrap font-bold"
				:class="{
					'text-base':
						CLIP.includes(tag) || BGM.includes(tag) || VIDEO.includes(tag),
					'text-white': SKIN.includes(tag) && color?.isDark,
					'text-black': SKIN.includes(tag) && color?.isLight,
				}"
			>
				{{ title }}
			</h3>
			<div
				class="flex w-full flex-col justify-start gap-0 text-sm"
				:class="{
					'text-gray-800':
						CLIP.includes(tag) || BGM.includes(tag) || VIDEO.includes(tag),
					'text-white': SKIN.includes(tag) && color?.isDark,
					'text-black': SKIN.includes(tag) && color?.isLight,
				}"
				style="--tw-text-opacity: 0.6"
			>
				<p
					v-if="isDiscountActive"
					class="flex gap-1 overflow-hidden text-ellipsis text-nowrap"
				>
					<span class="text-right" :class="{ 'font-bold': isDiscountActive }">
						{{ discountPrice }}
					</span>

					<span class="text-right" :class="{ 'font-bold': isDiscountActive }">
						{{ discountCurrency }}
					</span>
				</p>
				<p
					class="flex gap-1 overflow-hidden text-ellipsis text-nowrap"
					:class="{
						'line-through': isDiscountActive,
					}"
				>
					<span
						class="text-right text-[inherit]"
						:class="{ 'text-sm': isDiscountActive }"
					>
						{{ price }}
					</span>

					<span
						class="text-right text-[inherit]"
						:class="{ 'text-sm': isDiscountActive }"
					>
						{{ currency }}
					</span>
				</p>
			</div>
		</div>
		<Modal
			:is-visible="modalVisible"
			:modal-content="ModalContent"
			:attrs="{
				composedItem: composedItem,
			}"
			@close-event="modalClose"
		/>
	</div>
</template>
