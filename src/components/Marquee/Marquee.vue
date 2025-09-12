<script setup lang="ts">
import { markdownToHtml } from '@devprotocol/clubs-core'
import { GlobalConfig } from '../../types'
import { computed, onMounted, ref, useTemplateRef } from 'vue'

const props = defineProps<{
	messages?: GlobalConfig['marquee']
	color?: string
	langs?: string[]
}>()

enum Lang {
	EN = 'en',
	JA = 'ja',
}

const appLangs: Lang[] = [Lang.EN, Lang.JA]

const getLang = (vals?: string[]): Lang => {
	return (vals?.find((v) => appLangs.includes(v as Lang)) as Lang) ?? Lang.EN
}

const lang = ref(getLang(props.langs))

const contents = computed(() => {
	const tmp = (props.messages?.[lang.value] ?? []).map((msg) =>
		markdownToHtml(msg),
	)
	return [...tmp, ...tmp, ...tmp]
})

onMounted(() => {
	lang.value = getLang([...navigator.languages])
})
</script>

<template>
	<div
		v-if="contents.length"
		class="relative overflow-hidden rounded-md p-4 text-white"
		:class="{
			'bg-natural-600': props.color === undefined,
			'bg-[var(--marqueeColor)]': props.color,
		}"
		:style="props.color ? `--marqueeColor: ${props.color}` : undefined"
	>
		<div class="marquee flex w-fit gap-12">
			<div
				v-for="(value, i) in contents"
				:key="i"
				v-html="value"
				class="whitespace-nowrap [&_img]:max-h-[3vh] [&>p]:flex [&>p]:items-center [&>p]:gap-1"
			/>
		</div>
	</div>
</template>

<style scoped>
.marquee {
	animation: marquee 80s linear infinite;
}

@keyframes marquee {
	0% {
		transform: translateX(40%);
	}

	100% {
		transform: translateX(-100%);
	}
}
</style>
