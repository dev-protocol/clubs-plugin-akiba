<script setup lang="ts">
import { ref, computed } from 'vue'
import { GlobalConfig } from '../../types.ts'
import QuantitySelector from './QuantitySelector.vue'
import type { CheckoutFromPassportOffering } from '@devprotocol/clubs-plugin-passports'

type Props = {
	langs: string[]
	globalConfig: GlobalConfig
	passportOfferingsWithComposedData: CheckoutFromPassportOffering
}

type OfferingItem = {
	props: {
		offering?: {
			price: number;
			id: string;
			name: string;
			imageSrc: string;
		};
		amount?: number;
	};
	quantity?: number;
};


const { langs, globalConfig, passportOfferingsWithComposedData } =
	defineProps<Props>()

const quantities = ref(
  passportOfferingsWithComposedData.map(item => ({ id: item.props.offering.id, quantity: item.quantity || 1 }))
)

const updateQuantity = (index: number, newQuantity: number) => {
	quantities.value[index].quantity = newQuantity
}

const getPrice = (item: OfferingItem) => {
	return item.props?.offering?.price || item.props?.amount || 0
}

const totalAmount = computed(() => {
	return passportOfferingsWithComposedData.reduce(
		(total, item, index) => total + getPrice(item as OfferingItem) * quantities.value[index].quantity,
		0,
	)
})

const totalItems = computed(() => {
	return quantities.value.reduce((total, item) => total + item.quantity, 0)
})
</script>

<template>
	<div class="cart-container mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
		<div class="flex justify-between mb-2">
			<p class="text-2xl font-bold text-gray-900 sm:text-3xl">Cart</p>
			<img :src="globalConfig.logo" alt="Logo" class="max-w-80" />
		</div>

		<div class="cart-content flex flex-col gap-6 lg:flex-row lg:gap-8">
			<div class="cart-items min-w-0 flex-1">

				<div class="cart-items-list space-y-3 sm:space-y-4">
					<div
						v-for="(item, index) in passportOfferingsWithComposedData"
						:key="item.props.offering.id"
						class="cart-item bg-white p-3 sm:p-4"
					>
						<div class="flex items-center gap-3 sm:gap-4">
							<img
								:src="item.props.offering.imageSrc"
								:alt="item.props.offering.name"
								class="h-36 w-36 flex-shrink-0 rounded object-contain sm:h-40 sm:w-40"
							/>

							<div class="min-w-0 flex-1">
								<p
									class="text-sm font-bold text-gray-900"
								>
									{{ item.props.offering.name }}
								</p>
								<p class="text-sm text-gray-900 text-opacity-60">
									${{ item.props.offering.price }}
								</p>
							</div>

							<QuantitySelector
								:initial-value="quantities[index].quantity"
								@update:quantity="(value) => updateQuantity(index, value)"
							/>
						</div>
					</div>
				</div>
			</div>

			<div class="cart-summary w-full flex-shrink-0 lg:w-80 xl:w-96">
				<div
					class="sticky top-4 rounded-lg border border-gray-200 bg-gray-100 p-4 sm:p-6"
				>
					<div class="mb-4">
						<div
							class="flex flex-col items-start justify-between font-bold text-gray-900"
						>
							<span class="text-sm">Total</span>
							<span class="text-xl">${{ totalAmount }}</span>
						</div>
					</div>
					<button
						class="w-full py-2 rounded-full text-sm font-medium text-white bg-black transition-colors hover:bg-gray-800 sm:py-4 sm:text-base"
					>
						Buy {{ totalItems }} Items
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped></style>
