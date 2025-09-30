export const parsedLangs = (acceptLanguage?: string | null) =>
	acceptLanguage?.split(',').map((lang) => lang.trim().split(';')[0]) ?? ['en']
