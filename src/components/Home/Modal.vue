<script setup lang="ts">
import { Component as VueComponent } from 'vue'

defineProps<{
	isVisible: boolean
	modalContent: VueComponent
	attrs?: { [key: string]: any }
}>()
</script>

<style>
.v-enter-active {
	transition: transform 600ms cubic-bezier(0.07, 1.28, 0.5, 1);
}

.v-leave-active {
	transition: transform 600ms linear;
}

.v-enter-from {
	transform: translate(0, 100%);
}

.v-leave-to {
	transform: translate(0, 0);
}

html:has(dialog[open]) {
	overflow: hidden;
}
</style>

<template>
	<Teleport to="body">
		<dialog
			class="fixed inset-0 z-50 m-auto flex h-full max-h-full w-full max-w-full items-center justify-center overflow-y-auto bg-transparent backdrop:bg-black/60"
			v-if="isVisible"
			:open="isVisible"
			@click.stop="$emit('closeEvent')"
		>
			<div class="fixed inset-0 bg-black/60"></div>
			<Transition>
				<div
					class="pointer-events-none relative m-auto flex w-full justify-center py-12 lg:py-4"
					@click.stop
				>
					<div class="pointer-events-auto">
						<component v-show="isVisible" :is="modalContent" v-bind="attrs">
							<template #after:description>
								<slot name="after:description" />
							</template>
						</component>
					</div>
				</div>
			</Transition>
		</dialog>
	</Teleport>
</template>
