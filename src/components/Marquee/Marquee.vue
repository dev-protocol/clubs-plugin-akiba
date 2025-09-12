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

const marquee = useTemplateRef('marquee')

const marqueeWidth = ref(0)

const anim = computed(() => {
	return `-${marqueeWidth.value}px`
})

onMounted(() => {
	lang.value = getLang([...navigator.languages])
	marqueeWidth.value = marquee.value?.offsetWidth ?? 0
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
		<div ref="marquee" class="marquee flex w-fit gap-12">
			<div
				v-for="(value, i) in contents"
				:key="i"
				v-html="value"
				class="whitespace-nowrap [&_img]:max-h-[3vh] [&>p]:flex [&>p]:w-max [&>p]:items-center [&>p]:gap-1"
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
		margin-left: 100%;
	}

	100% {
		margin-left: v-bind(anim);
	}
}
</style>
