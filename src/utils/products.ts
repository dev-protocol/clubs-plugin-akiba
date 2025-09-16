import { getTagName } from './filtering-clips'
import { CategoriesConfig, Product } from '../types'
import { bytes32Hex } from '@devprotocol/clubs-core'

export const toProductsMap = (
	items: Product[],
	categories?: CategoriesConfig,
) =>
	items.reduce(
		(acc, item) => {
			const key = getTagName(item.product.props)
			const cat = categories?.find((c) =>
				c.payloads?.find(
					(p) => bytes32Hex(p) === bytes32Hex(item.product.payload),
				),
			)

			return {
				...acc,
				[key]: [...(acc[key] ?? []), item],
				...(cat && cat.as !== key
					? { [cat.as]: [...(acc[cat.as] ?? []), item] }
					: {}),
			}
		},
		{} as {
			[key: string]: Product[]
		},
	)
