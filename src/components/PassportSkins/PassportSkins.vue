<script setup lang="ts">
import Image01 from '../../assets/passportSkins/image01.png'
</script>

<template>
	<div>
		<div class="mb-4">
			<h2 class="text-2xl">Passport Skins</h2>
		</div>
		<div>
			<div class="contents__wrapper flex flex-col gap-2 rounded p-2">
				<div class="mb-2 w-full rounded object-contain">
					<img :src="Image01.src" alt="Passport Skins" class="w-full" />
				</div>
				<div class="flex w-[9.357rem] flex-col gap-1">
					<h3
						class="overflow-hidden text-ellipsis text-nowrap text-base font-bold"
					>
						Mystic Horizon
					</h3>
					<p
						class="overflow-hidden text-ellipsis text-nowrap text-sm text-white"
						style="--tw-text-opacity: 0.6"
					>
						$4.9
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.contents__wrapper {
	background-color: hsl(247, 45%, 31%);
}
</style>
