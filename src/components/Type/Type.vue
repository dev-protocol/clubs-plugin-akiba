<script setup lang="ts">
import { i18nFactory } from '@devprotocol/clubs-core'
import { onMounted, ref } from 'vue'

const {
	type = 'digital',
	langs: _langs,
	class: _class,
	color,
} = defineProps<{
	type?: 'digital'
	langs: string[]
	class?: string
	color?: {
		bg?: string
		ink?: string
	}
}>()

const langs = ref(_langs)
const i18nBase = i18nFactory({
	Digital: { ja: 'デジタル', en: 'Digital' },
})
const i18n = ref(i18nBase(langs.value))

onMounted(() => {
	langs.value = [...navigator.languages]
	i18n.value = i18nBase(langs.value)
})
</script>

<template>
	<span
		class="inline-block rounded px-1.5 py-0.5 text-xs font-normal"
		:class="[
			_class,
			{
				'bg-blue-100': !color?.bg,
				'text-gray-800': !color?.ink,
				[color?.bg ?? '']: !!color?.bg,
				[color?.ink ?? '']: !!color?.ink,
			},
		]"
		>{{ i18n('Digital') }}</span
	>
</template>
