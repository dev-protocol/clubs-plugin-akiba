import clubs from '@devprotocol/clubs-core/tailwind'
import typography from '@tailwindcss/typography'

export default {
	presets: [clubs],
	content: [...clubs.content, 'preview/src/**/*'],
	plugins: [typography],
}
