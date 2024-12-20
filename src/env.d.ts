/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module '*.astro' {
	import type { AstroComponentFactory } from 'astro/dist/runtime/server'
	export default InstanceType<AstroComponentFactory>
}

declare module '*.png'
declare module '*.svg'
declare module '*.jpeg'
declare module '*.jpg'
