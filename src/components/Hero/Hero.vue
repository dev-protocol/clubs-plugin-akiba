<script setup lang="ts">
import { defineProps } from 'vue'

type Props = {
	image?: string
	logo?: string
	text?: string
	gradientColor?: string
	copyright?: string
}

const { image, logo, text } = defineProps<Props>()
</script>

<template>
	<section
		class="container mx-auto md:mb-2 md:p-2"
		oncontextmenu="return false"
	>
		<div
			class="relative flex overflow-hidden rounded-b-xl md:aspect-[2/1] md:justify-end md:rounded-2xl"
			:style="`background-color: ${gradientColor};`"
		>
			<img
				:src="image"
				class="pointer-events-none absolute top-0 aspect-[3/4] w-full object-cover md:relative md:aspect-[4/3] md:h-full md:w-auto"
			/>
			<div
				class="relative inset-0 grid grid-cols-1 grid-rows-[auto_1fr] justify-center md:absolute md:grid-cols-2 md:grid-rows-1"
			>
				<span class="row-start-1 aspect-square md:col-start-2"></span>
				<span
					class="gradient row-start-2 flex flex-col justify-center gap-2 p-8 md:col-start-1 md:row-start-1"
				>
					<img :src="logo" class="" alt="" />
					<p v-if="text" class="leading-none text-white md:leading-normal">
						{{ text }}
					</p>
					<p
						v-if="copyright"
						class="place-self-end self-end text-sm text-white opacity-50 md:absolute md:bottom-8 md:left-8"
					>
						{{ copyright }}
					</p>
				</span>
			</div>
		</div>
	</section>
</template>

<style scoped>
.gradient {
	background-image: linear-gradient(
		0deg,
		v-bind(gradientColor) 63%,
		transparent 100%
	);
}

@media (min-width: 768px) {
	.gradient {
		background-image: linear-gradient(
			90deg,
			v-bind(gradientColor) 70%,
			transparent 100%
		);
	}
}
</style>
