<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
	initialValue?: number
	min?: number
	max?: number
	disabled?: boolean
}>()

const emit = defineEmits<{
	(e: 'update:quantity', value: number): void
}>()

const quantity = ref(props.initialValue ?? 1)

watch(
	() => props.initialValue,
	(v) => {
		if (typeof v !== 'undefined') {
			quantity.value = v ?? 1
		}
	},
)

const decrement = () => {
	if (quantity.value > (props.min ?? 0)) {
		quantity.value--
		emit('update:quantity', quantity.value)
	}
}

const increment = () => {
	if (!props.max || quantity.value < props.max) {
		quantity.value++
		emit('update:quantity', quantity.value)
	}
}

const clamp = (value: number) =>
	Math.max(props.min ?? 1, Math.min(props.max ?? Infinity, value))

const onInput = (event: Event) => {
	const value = parseInt((event.target as HTMLInputElement).value)
	if (!isNaN(value)) {
		quantity.value = clamp(value)
	}
}

const commitFromEvent = (event: Event) => {
	const value = parseInt((event.target as HTMLInputElement).value)
	if (!isNaN(value)) {
		const validValue = clamp(value)
		quantity.value = validValue
		emit('update:quantity', quantity.value)
	} else {
		;(event.target as HTMLInputElement).value = quantity.value.toString()
	}
}

const isMinQuantity = computed(() => {
	return quantity.value === 1
})
</script>

<template>
	<div
		class="flex h-10 items-center overflow-hidden rounded-full border border-gray-200 bg-white"
	>
		<button
			type="button"
			class="flex h-full w-10 cursor-pointer items-center justify-center focus:ring-0 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
			:disabled="disabled"
			@click="decrement"
		>
			<template v-if="isMinQuantity">
				<svg
					width="14"
					height="14"
					viewBox="0 0 14 14"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<g clip-path="url(#clip0_5011_2622)">
						<path
							d="M9.07734 6.74392L8.23793 7.58333L9.07734 8.42275C9.41918 8.76458 9.41918 9.31817 9.07734 9.66C8.90643 9.83092 8.68243 9.91608 8.45843 9.91608C8.23443 9.91608 8.01043 9.83092 7.83951 9.66L7.00009 8.82058L6.16068 9.66C5.98976 9.83092 5.76576 9.91608 5.54176 9.91608C5.31776 9.91608 5.09376 9.83092 4.92284 9.66C4.58101 9.31817 4.58101 8.76458 4.92284 8.42275L5.76226 7.58333L4.92284 6.74392C4.58101 6.40208 4.58101 5.8485 4.92284 5.50667C5.26468 5.16483 5.81826 5.16483 6.16009 5.50667L6.99951 6.34608L7.83893 5.50667C8.18076 5.16483 8.73434 5.16483 9.07618 5.50667C9.41801 5.8485 9.41801 6.40208 9.07618 6.74392H9.07734ZM14.0001 2.625C14.0001 3.108 13.6087 3.5 13.1251 3.5H12.7634L12.1334 11.0583C11.9963 12.7079 10.5917 14 8.93618 14H5.06343C3.40793 14 2.00326 12.7079 1.86618 11.0583L1.23618 3.5H0.874512C0.390928 3.5 -0.000488281 3.108 -0.000488281 2.625C-0.000488281 2.142 0.390928 1.75 0.874512 1.75H3.64943C4.01051 0.7315 4.98351 0 6.12451 0H7.87451C9.01551 0 9.98851 0.7315 10.3496 1.75H13.1245C13.6081 1.75 14.0001 2.142 14.0001 2.625ZM11.0076 3.5H2.99259L3.61034 10.9124C3.67276 11.6626 4.31151 12.25 5.06401 12.25H8.93676C9.68926 12.25 10.3274 11.6626 10.3904 10.9124L11.0076 3.5Z"
							fill="black"
						/>
					</g>
					<defs>
						<clipPath id="clip0_5011_2622">
							<rect width="14" height="14" fill="white" />
						</clipPath>
					</defs>
				</svg>
			</template>
			<template v-else>
				<svg
					width="14"
					height="2"
					viewBox="0 0 14 2"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M1 1H13"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</template>
		</button>

		<input
			type="text"
			class="h-full w-10 border-none bg-white text-center text-sm focus:ring-0 focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
			:value="quantity"
			:disabled="disabled"
			@input="onInput"
			@blur="commitFromEvent"
			@keydown.enter.prevent="commitFromEvent"
		/>

		<button
			type="button"
			class="flex h-full w-10 cursor-pointer items-center justify-center focus:ring-0 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
			:disabled="disabled"
			@click="increment"
		>
			<svg
				width="14"
				height="14"
				viewBox="0 0 14 14"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M7 1V13M1 7H13"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</button>
	</div>
</template>
