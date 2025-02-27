<script setup lang="ts">
import { defineProps, onMounted, ref } from 'vue'
import { i18nFactory } from '@devprotocol/clubs-core'
import type { HomeConfig } from '../../types.ts'

type Props = {
	feature: HomeConfig['features'][0]
	asPlaceholder?: boolean
	langs: string[]
}

const { feature, asPlaceholder, langs } = defineProps<Props>()

const i18nBase = i18nFactory({
	title: feature.title,
	description: feature.description,
})
const i18nLinkBase = feature.link
	? i18nFactory({
			link:
				typeof feature.link === 'string'
					? { en: feature.link, ja: feature.link }
					: feature.link,
		})
	: undefined
const i18n = ref<ReturnType<typeof i18nBase>>(i18nBase(langs))
const i18nLink = ref(i18nLinkBase?.(langs))
onMounted(() => {
	i18n.value = i18nBase(navigator.languages)
	i18nLink.value = i18nLinkBase?.(navigator.languages)
})
</script>

<template>
	<a
		class="relative block flex aspect-[5/3] w-full overflow-hidden rounded-2xl md:aspect-[5/3] md:flex-row"
		:href="i18nLink ? i18nLink('link') : undefined"
		:role="feature.link ? 'link' : 'generic'"
		:target="feature.link ? '_blank' : undefined"
	>
		<div
			role="presentation"
			class="absolute inset-0 bg-cover bg-no-repeat"
			:style="`background-image: url(${feature.image});`"
			:class="[{ '-m-3 animate-pulse blur-md': asPlaceholder }]"
		></div>
		<div
			v-if="!asPlaceholder"
			class="relative flex w-full flex-col items-start justify-end p-6 font-bold text-white"
			:style="`background-image: linear-gradient(0deg, ${feature.color} 20%, transparent 50%);`"
		>
			<p class="text-[8.142vw] md:text-[1.852vw]">
				{{ i18n('title') }}
			</p>
			<p class="text-[3.563vw] md:text-[0.810vw]">
				{{ i18n('description') }}
			</p>
		</div>
	</a>
</template>

<style scoped></style>
