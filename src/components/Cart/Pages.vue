<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { GlobalConfig } from '../../types.ts'
import QuantitySelector from './QuantitySelector.vue'
import type {
  CheckoutFromPassportOffering,
  CheckoutItemPassportOffering,
} from '@devprotocol/clubs-plugin-passports'

type Props = {
  langs: string[]
  globalConfig: GlobalConfig
  passportOfferingsWithComposedData: CheckoutFromPassportOffering
  base: string
}

enum CartItemStatus {
  Completed = 'completed',
}

type CartItem = {
  scope: string
  eoa: string
  payload: string
  quantity: number
  status?: CartItemStatus
  session: string
  order_id?: string
  ordered_at?: number
}

type APICartResult = {
  total: number
  data: (CartItem & {
    passportItem?: CheckoutItemPassportOffering
    bundledPassportItems?: CheckoutItemPassportOffering[]
  })[]
}

const {
  globalConfig,
  base,
  langs: _langs,
  passportOfferingsWithComposedData: _passportOfferingsWithComposedData,
} = defineProps<Props>()

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

onMounted(async () => {
  try {
    const { connection } = await import('@devprotocol/clubs-core/connection')
    const conn = connection()

    const fetchCartWithSigner = async (sgn: any) => {
      try {
        if (!sgn) {
          resetQuantities()
          isLoading.value = false
          return
        }

        isLoading.value = true
        signature.value = await sgn.signMessage(message)

        const url = `${base}/api/devprotocol:clubs:plugin:clubs-payments/cart/?message=${message}&signature=${signature.value}`
        const res = await fetch(url, {
          headers: { accept: 'application/json' },
        })

        if (!res.ok)
          throw new Error(
            `Failed to fetch cart: ${res.status} ${res.statusText}`,
          )

        // APICartResultとして受け取る
        const data = (await res.json()) as APICartResult
        console.log('Fetched cart data:', data)

        cartItems.value = data?.data ?? []
				cartItemTotal.value = data?.total ?? 0
      } catch (err) {
        console.error('Failed to fetch cart items with signer:', err)
      } finally {
        resetQuantities()
        isLoading.value = false
      }
    }

    const currentSigner = conn.signer.value

    conn.signer.subscribe(async (newSigner: any) => {
      if (newSigner) {
        await fetchCartWithSigner(newSigner)
      } else {
        cartItems.value = []
        resetQuantities()
        isLoading.value = false
      }
    })

    if (currentSigner) {
      await fetchCartWithSigner(currentSigner)
    } else {
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

const getUnitPrice = (item: APICartResult['data'][number]): number => {
	const main = Number(item.passportItem?.props?.amount ?? 0)
	const bundled = (item.bundledPassportItems ?? []).reduce((sum, b) => {
		return sum + Number(b?.props?.amount ?? 0)
	}, 0)
	return main + bundled
}

const totalAmount = computed(() => {
	return cartItems.value.reduce((total, item, index) => {
		const qty =
			quantities.value[index]?.quantity ??
			item.quantity ??
			1
		return total + getUnitPrice(item) * qty
	}, 0)
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
              <span class="text-xl">${{ totalAmount.toFixed(2) }}</span>
            </div>
          </div>
          <button
            class="w-full rounded-full bg-black py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 sm:py-4 sm:text-base"
            :disabled="isLoading"
            @click="handleBuy"
          >
            <span
              v-if="isLoading"
              class="flex items-center justify-center gap-2"
            >
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
            <span v-else> Buy {{ totalItems }} Items </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
