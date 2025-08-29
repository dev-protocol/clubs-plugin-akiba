<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { GlobalConfig } from '../../types.ts'
import QuantitySelector from './QuantitySelector.vue'
import Modal from '../Home/Modal.vue'
import CheckoutCompletedModalContent from './CheckoutCompletedModalContent.vue'
import type {
	CheckoutFromPassportOffering,
	CheckoutItemPassportOffering,
} from '@devprotocol/clubs-plugin-passports'
import { Pay } from '@devprotocol/clubs-plugin-payments/components'

type Props = {
	langs: string[]
	globalConfig: GlobalConfig
	passportOfferingsWithComposedData: CheckoutFromPassportOffering
	base: string
}

type CartItem = {
	scope: string
	eoa: string
	payload: string
	quantity: number
	session: string
	order_id?: string
}

type APICartResult = {
	total: number
	data: (CartItem & {
		passportItem?: CheckoutItemPassportOffering
		bundledPassportItems?: CheckoutItemPassportOffering[]
	})[]
}

const { globalConfig, base } = defineProps<Props>()

const message = 'message'
const signature = ref<string | undefined>(undefined)
const isLoading = ref<boolean>(true)

const cartItems = ref<APICartResult['data']>([])
const cartItemTotal = ref<number>(1)

const quantities = ref<{ id: string; quantity: number }[]>([])
const resetQuantities = () => {
	quantities.value = (cartItems.value || []).map((item) => ({
		id: item.payload,
		quantity: item.quantity || 1,
	}))
}
const isUpdating = ref<{ [payload: string]: boolean }>({})

const fetchCart = async (options?: { showGlobalLoading?: boolean }) => {
	const show = options?.showGlobalLoading ?? true

	if (!signature.value) {
		cartItems.value = []
		resetQuantities()
		// if (show) isLoading.value = false
		return
	}

	try {
		if (show) isLoading.value = true

		const url = `${base}/api/devprotocol:clubs:plugin:clubs-payments/cart/?message=${message}&signature=${signature.value}`
		const res = await fetch(url, { headers: { accept: 'application/json' } })

		if (!res.ok) {
			throw new Error(`Failed to fetch cart: ${res.status} ${res.statusText}`)
		}

		const data = (await res.json()) as APICartResult
		cartItems.value = data?.data ?? []
		cartItemTotal.value = data?.total ?? 0
	} catch (err) {
		console.error('Failed to fetch cart:', err)
	} finally {
		resetQuantities()
		if (show) isLoading.value = false
	}
}

const setSignatureAndFetch = async (
	sgn: any,
	options?: { showGlobalLoading?: boolean },
) => {
	if (!sgn) {
		signature.value = undefined
		cartItems.value = []
		resetQuantities()
		// isLoading.value = false
		return
	}
	signature.value = await sgn.signMessage(message)
	await fetchCart(options)
}

const isClient = ref(false)

onMounted(async () => {
	isClient.value = true

	try {
		const { connection } = await import('@devprotocol/clubs-core/connection')
		const conn = connection()

		const currentSigner = conn.signer.value

		conn.signer.subscribe(async (newSigner: any) => {
			await setSignatureAndFetch(newSigner, { showGlobalLoading: true })
		})

		await setSignatureAndFetch(currentSigner, { showGlobalLoading: true })
	} catch (err) {
		console.error('Failed to initialize connection or watch signer:', err)
		resetQuantities()
		isLoading.value = false
	}
})

const updateQuantity = async (index: number, newQuantity: number) => {
	quantities.value[index].quantity = newQuantity

	const target = cartItems.value[index]
	if (!target) return

	const key = target.payload

	if (isUpdating.value[key]) return

	if (!signature.value) {
		console.warn('No signature available. Skip API call for quantity update.')
		return
	}

	try {
		isUpdating.value[key] = true

		const postRes = await fetch(
			`${base}/api/devprotocol:clubs:plugin:clubs-payments/cart/`,
			{
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					message,
					signature: signature.value,
					payload: target.payload,
					quantity: newQuantity,
				}),
			},
		)

		if (!postRes.ok) {
			throw new Error(
				`Failed to update quantity: ${postRes.status} ${postRes.statusText}`,
			)
		}

		await fetchCart({ showGlobalLoading: false })
	} catch (err) {
		console.error('Failed to update cart quantity:', err)
	} finally {
		isUpdating.value[key] = false
	}
}

const getUnitPrice = (item: APICartResult['data'][number]): number => {
	const main = Number(item.passportItem?.props?.amount ?? 0)
	const bundled = (item.bundledPassportItems ?? []).reduce((sum, b) => {
		return sum + Number(b?.props?.amount ?? 0)
	}, 0)
	return main + bundled
}

const totalAmount = computed(() => {
	return cartItems.value.reduce((total, item, index) => {
		const qty = quantities.value[index]?.quantity ?? item.quantity ?? 1
		return total + getUnitPrice(item) * qty
	}, 0)
})

const isCheckoutCompletedVisible = ref(false)
const completedDetail = ref<any | null>(null)

const closeCompletedModal = () => {
	isCheckoutCompletedVisible.value = false
}

const onCheckoutCompleted = (ev: Event) => {
	completedDetail.value = (ev as CustomEvent).detail
	isCheckoutCompletedVisible.value = true
	fetchCart({ showGlobalLoading: true })
}

onMounted(() => {
	window.addEventListener(
		'checkout:completed',
		onCheckoutCompleted as EventListener,
	)
})

onBeforeUnmount(() => {
	window.removeEventListener(
		'checkout:completed',
		onCheckoutCompleted as EventListener,
	)
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
				<div v-if="isLoading" class="cart-items-list space-y-3 sm:space-y-4">
					<div
						v-for="n in Math.max(cartItemTotal || 0, 1)"
						:key="'skeleton-' + n"
						class="cart-item bg-white p-3 sm:p-4"
					>
						<div class="flex animate-pulse items-center gap-3 sm:gap-4">
							<div
								class="h-36 w-36 flex-shrink-0 rounded bg-gray-200 sm:h-40 sm:w-40"
							></div>

							<div class="min-w-0 flex-1 space-y-2">
								<div class="h-4 w-1/2 rounded bg-gray-200"></div>
								<div class="h-4 w-1/4 rounded bg-gray-200"></div>
							</div>

							<div class="h-10 w-28 rounded-full bg-gray-200"></div>
						</div>
					</div>
				</div>
				<div v-else class="cart-items-list space-y-3 sm:space-y-4">
					<div
						v-for="(item, index) in cartItems"
						:key="item.order_id ?? item.payload"
						class="cart-item bg-white p-3 sm:p-4"
					>
						<div class="flex items-center gap-3 sm:gap-4">
							<img
								:src="item.passportItem?.props.itemImageSrc"
								:alt="item.passportItem?.props?.itemName"
								class="h-36 w-36 flex-shrink-0 rounded object-contain sm:h-40 sm:w-40"
							/>

							<div class="min-w-0 flex-1">
								<p class="text-sm font-bold text-gray-900">
									{{ item.passportItem?.props.itemName }}
								</p>
								<p class="text-opacity-60 text-sm text-gray-900">
									${{ item.passportItem?.props.amount }}
								</p>
							</div>

							<QuantitySelector
								:initial-value="quantities[index]?.quantity ?? 1"
								:disabled="isUpdating[item.payload] === true"
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
						<div v-if="isLoading" class="space-y-2">
							<div class="h-4 w-16 rounded bg-gray-200"></div>
							<div class="h-6 w-28 rounded bg-gray-200"></div>
						</div>
						<div
							v-else
							class="flex flex-col items-start justify-between font-bold text-gray-900"
						>
							<span class="text-sm">Total</span>
							<span class="text-xl">${{ totalAmount.toFixed(2) }}</span>
						</div>
					</div>
					<div v-if="isLoading" class="h-16 w-full rounded bg-gray-300"></div>
					<Pay v-else :cart="true" :base="base" :debugMode="true" />
				</div>
			</div>
		</div>
	</div>

	<Modal
		v-if="isClient && isCheckoutCompletedVisible"
		:is-visible="isCheckoutCompletedVisible"
		:modal-content="CheckoutCompletedModalContent"
		:attrs="{ detail: completedDetail, onClose: closeCompletedModal }"
		@closeEvent="closeCompletedModal"
	/>
</template>

<style scoped>
@keyframes spin8932 {
	to {
		transform: rotate(360deg);
	}
}
#circle8932 {
	transform-origin: 50% 50%;
	stroke: url(#RadialGradient8932);
	fill: none;
	animation: spin8932 0.5s infinite linear;
}
</style>
