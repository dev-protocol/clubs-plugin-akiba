<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { StringOrI18n } from '../../types'
import { i18nFactory } from '@devprotocol/clubs-core'

const props = defineProps<{
	class: string
	src?: StringOrI18n
	alt?: string
	langs?: string[]
}>()

const langs = ref(props.langs ?? ['en'])
const i18nBase = i18nFactory({
	i:
		typeof props.src === 'string'
			? { en: props.src, ja: props.src }
			: (props.src ?? {}),
})
const i18n = ref(i18nBase(langs.value))

onMounted(() => {
	langs.value = [...navigator.languages]
	i18n.value = i18nBase(langs.value)
})
</script>

<template>
	<img :src="i18n('i')" :alt="props.alt" :class="props.class" />
</template>
