import { getTagName } from './filtering-clips'
import { CategoriesConfig, Product } from '../types'
import { bytes32Hex } from '@devprotocol/clubs-core'
import { whenDefined } from '@devprotocol/util-ts'

export const toProductsMap = (
	items: Product[],
	categories?: CategoriesConfig,
	{ unique = true }: { unique?: boolean } = {},
) => {
	const group = new Set<string>()

	return items.reduce(
		(acc, item) => {
			const key = getTagName(item.product.props)
			const cat = categories?.find((c) =>
				c.payloads?.find(
					(p) => bytes32Hex(p) === bytes32Hex(item.product.payload),
				),
			)

			if (unique) {
				const groupOf = item.product.props.offering.groupOf
				const included = groupOf ? group.has(groupOf) : false

				if (included) {
					return acc
				}

				// eslint-disable-next-line functional/no-expression-statements, functional/immutable-data
				whenDefined(groupOf, (g) => group.add(g))
			}

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
}
