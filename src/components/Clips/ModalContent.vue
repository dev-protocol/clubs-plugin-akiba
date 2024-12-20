<script setup lang="ts">
import type { ComposedCheckoutOptions } from '@devprotocol/clubs-plugin-passports'
import { ComposedCheckout } from '@devprotocol/clubs-plugin-passports/components'

type Props = {
	composedItem: { payload: string; props: ComposedCheckoutOptions }
}

const { composedItem } = defineProps<Props>()
</script>

<template>
	<div class="rounded-xl bg-white p-4 text-black shadow">
		<ComposedCheckout v-bind="composedItem.props" />
	</div>
</template>
