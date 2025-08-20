<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { GlobalConfig } from '../../types.ts'
import QuantitySelector from './QuantitySelector.vue'
import type { CheckoutFromPassportOffering } from '@devprotocol/clubs-plugin-passports'

type Props = {
	langs: string[]
	globalConfig: GlobalConfig
	passportOfferingsWithComposedData: CheckoutFromPassportOffering
	base: string
}

type OfferingItem = {
	props: {
		offering?: {
			price: number
			id: string
			name: string
			imageSrc: string
		}
		amount?: number
	}
	quantity?: number
}

const { langs, globalConfig, passportOfferingsWithComposedData, base } =
	defineProps<Props>()

const message = 'message'
const signature = ref<string | undefined>(undefined)
const isLoading = ref<boolean>(true)

const cartItems = ref(passportOfferingsWithComposedData as unknown as any[])

const quantities = ref<{ id: string; quantity: number }[]>([])
const resetQuantities = () => {
	quantities.value = (cartItems.value || []).map((item: any) => ({
		id: item?.props?.offering?.id,
		quantity: item?.quantity || 1,
	}))
}

onMounted(async () => {
  try {
    const { connection } = await import('@devprotocol/clubs-core/connection')
    const conn = connection()

    const fetchCartWithSigner = async (sgn: any) => {
      try {
        isLoading.value = true
        signature.value = await sgn.signMessage(message)

        const url = `${base}/api/devprotocol:clubs:plugin:clubs-payments/cart/?message=${message}&signature=${signature.value}`
        const res = await fetch(url, { headers: { accept: 'application/json' } })

        if (!res.ok) throw new Error(`Failed to fetch cart: ${res.status} ${res.statusText}`)
        const data = await res.json()
        console.log('Fetched cart data:', data)

        if (Array.isArray(data)) cartItems.value = data as any[]
      } catch (err) {
        console.error('Failed to fetch cart items with signer:', err)
      } finally {
        resetQuantities()
        isLoading.value = false
      }
    }

    const currentSigner = conn.signer.value

    if (currentSigner) {
      await fetchCartWithSigner(currentSigner)
    } else {
      const stop = watch(
        () => conn.signer.value,
        async (newSigner) => {
          if (newSigner) {
						console.log('Signer(watch):', newSigner)
            await fetchCartWithSigner(newSigner)
            stop()
          }
        },
        { immediate: false },
      )
      resetQuantities()
      isLoading.value = false
    }
  } catch (err) {
    console.error('Failed to initialize connection or watch signer:', err)
    resetQuantities()
    isLoading.value = false
  }
})

const updateQuantity = (index: number, newQuantity: number) => {
	quantities.value[index].quantity = newQuantity
}

const getPrice = (item: OfferingItem) => {
	return item.props?.offering?.price || item.props?.amount || 0
}

const totalAmount = computed(() => {
	return cartItems.value.reduce(
		(total, item, index) =>
			total + getPrice(item as OfferingItem) * (quantities.value[index]?.quantity ?? 1),
		0,
	)
})

const totalItems = computed(() => {
	return quantities.value.reduce((total, item) => total + item.quantity, 0)
})

const handleBuy = () => {}
</script>

<template>
	<div class="cart-container mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
		<div class="mb-2 flex justify-between">
			<p class="text-2xl font-bold text-gray-900 sm:text-3xl">Cart</p>
			<img :src="globalConfig.logo" alt="Logo" class="max-w-80" />
		</div>

		<div class="cart-content flex flex-col gap-6 lg:flex-row lg:gap-8">
			<div class="cart-items min-w-0 flex-1">
				<div class="cart-items-list space-y-3 sm:space-y-4">
					<div
						v-for="(item, index) in cartItems"
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
								<p class="text-sm font-bold text-gray-900">
									{{ item.props.offering.name }}
								</p>
								<p class="text-opacity-60 text-sm text-gray-900">
									${{ item.props.offering.price }}
								</p>
							</div>

							<QuantitySelector
								:initial-value="quantities[index]?.quantity ?? 1"
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
						class="w-full rounded-full bg-black py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed sm:py-4 sm:text-base"
						:disabled="isLoading"
						@click="handleBuy"
					>
						<span v-if="isLoading" class="flex items-center justify-center gap-2">
							<svg
								class="h-4 w-4 animate-spin text-white"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
								/>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
								/>
							</svg>
							Loading...
						</span>
						<span v-else>
							Buy {{ totalItems }} Items
						</span>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped></style>
