import { encode } from '@devprotocol/clubs-core'
import { GlobalConfig, HomeConfig } from '../src/types'
import HeroImage from '../src/assets/bg_image01.png'
import Logo from '../src/assets/logo.png'
import Gallery1 from '../src/assets/gallery/image01.png'
import Gallery2 from '../src/assets/gallery/image02.png'
import Gallery3 from '../src/assets/gallery/image03.png'
import Gallery4 from '../src/assets/gallery/image04.png'

export default () =>
	encode({
		name: 'passport-akiba-staging',
		twitterHandle: '',
		description: '',
		url: 'http://localhost:4321',
		propertyAddress: '0x18748FCfA818Ca035bB6eC68C5C58eBE0Db1E32a',
		adminRolePoints: 50,
		chainId: 137,
		rpcUrl: 'https://polygon-rpc.com',
		options: [
			{
				key: 'navigationLinks',
				value: [
					{
						display: 'Home',
						path: '/',
					},
				],
			},
			{
				key: 'avatarImgSrc',
				value: 'https://i.imgur.com/lSpDjrr.jpg',
			},
			{
				key: '__draft',
				value: {
					isInDraft: false,
					address: '0xfc4a9e2B406C515415BBcF502A632aefB185A875',
				},
			},
		],
		plugins: [
			{
				id: 'devprotocol:clubs:plugin:akiba',
				options: [
					{
						key: 'homeConfig',
						value: {
							hero: {
								image: HeroImage.src,
								color: '#4a0c43',
								text: {
									ja: 'Into a world where magic and mystery intertwine.',
									en: 'Into a world where magic and mystery intertwine.',
								},
							},
							features: [
								{
									image: Gallery1.src,
									title: { ja: 'ニュースキンが可能', en: 'New skin available' },
									description: { ja: 'ただいまご予約受付中', en: 'Get Now' },
									link: {
										en: 'https://example.com/en',
										ja: 'https://example.com/ja',
									},
								},
								{
									image: 'https://picsum.photos/512/308',
									title: {
										ja: 'メタリック アート キャンバス',
										en: 'Metallic Art Canvas',
									},
									description: {
										ja: 'ただいまご予約受付中',
										en: 'Now Accepting Reservations',
									},
									link: 'https://example.com',
								},
								{
									image: Gallery2.src,
									title: { ja: 'ニュースキンが可能', en: 'New skin available' },
									description: { ja: 'ただいまご予約受付中', en: 'Get Now' },
									link: '',
								},
								{
									image: Gallery3.src,
									title: {
										ja: 'メタリック アート キャンバス２',
										en: 'Metallic Art Canvas',
									},
									description: {
										ja: 'ただいまご予約受付中',
										en: 'Now Accepting Reservations',
									},
									link: '',
								},
								{
									image: Gallery4.src,
									title: {
										ja: 'ニュースキンが可能３',
										en: 'New skin available',
									},
									description: { ja: 'ただいまご予約受付中', en: 'Get Now' },
									link: '',
								},
							],
							body: 'Hendrerit pellentesque tincidunt, sociis dictumst.',
							description: 'Description',
						} satisfies HomeConfig,
					},
					{
						key: 'globalConfig',
						value: {
							bg: '#fff',
							ink: '#000',
							logo: Logo.src,
							copyright: '🄫CLUBS - FRAME00 Example',
							marquee: {
								en: ['Welcome to our club!', 'Enjoy your stay!'],
								ja: [
									'私たちのクラブへようこそ！',
									'ごゆっくりお楽しみください！',
								],
							},
						} satisfies GlobalConfig,
					},
					{
						key: 'categories',
						value: [
							{
								as: 'Kawaii',
								label: { en: 'Kawaii', ja: 'かわいい' },
								payloads: [
									'0x36a27bd40a9e230d1cbc19143dcde98a898d04a33559a4d2681fb04c739652bd',
									'0xf1fd783e7519b7162e67944dfcbe44661718bbcd79f2cd941f8e2701f9893b3d',
								],
							},
							{
								as: 'Animals',
								label: { en: 'Animals', ja: '動物' },
								payloads: [
									'0x527e51670240bffb207f7efb52e53c588efadc82db05eda58680e42f82f81c3f',
									'0xef1907ffea2cf408f2d1c5ec95289402d03859158b2661ad7a2a3bd06dff1f9c',
								],
							},
							{
								as: 'Animated Sticker',
								banner: {
									en: 'https://i.imgur.com/ldH4ZIo.jpg',
									ja: 'https://i.imgur.com/ldH4ZIo.jpg',
								},
							},
						],
					},
				],
			},
			{
				id: 'example',
				options: [],
			},
			{
				id: 'clubs-core:admin',
				name: 'admin',
				options: [],
			},
			{
				id: 'devprotocol:clubs:theme-1',
				name: 'defaultTheme',
				options: [
					{
						key: 'globalConfig',
						value: {
							bg: 'rgba(131, 138, 176, 1)',
							backgroundGradient: [
								'rgba(204, 0, 255, 0.2)',
								'rgba(204, 0, 255, 0)',
							],
						},
					},
					{
						key: 'homeConfig',
						value: {
							hero: {
								image: 'https://i.imgur.com/ldH4ZIo.jpg',
							},
							description:
								'I create art in Canada using flowers and light refraction. Recently, I have focused on creating online artworks that allow user interaction through JavaScript.',
							body: "### Hi, I'm Alice!\n\nhttps://www.youtube.com/watch?v=WgDAezl1RrQ\n\nThe YouTube link you place will automatically display embedded. Try it! YouTube video can be a great help in making your activities briefly known.\n\nWant to use images in your description? Then try writing it like the following. You can see how the image will display later on the [Preview] page.\n\n![](https://images.unsplash.com/photo-1674420628423-bf7a338af32d)\n",
						},
					},
				],
			},
			{
				id: 'devprotocol:clubs:plugin:join',
				name: 'join',
				options: [],
			},
			{
				id: 'devprotocol:clubs:plugin:me',
				name: 'me',
				options: [],
			},
			{
				id: 'devprotocol:clubs:plugin:community',
				name: 'community',
				options: [],
			},
			{
				id: 'devprotocol:clubs:plugin:quests',
				name: 'quests',
				options: [],
			},
			{
				id: 'devprotocol:clubs:plugin:members',
				name: 'members',
				options: [],
			},
			{
				id: 'devprotocol:clubs:simple-memberships',
				name: 'memberships',
				options: [],
			},
			{
				id: 'devprotocol:clubs:gated-contact-form',
				name: 'message',
				options: [],
			},
			{
				id: 'devprotocol:clubs:clubsx:marketplace',
				name: 'marketplace',
				options: [],
			},
			{
				id: 'devprotocol:clubs:plugin:clubs-payments',
				options: [{ key: 'debug', value: true }],
			},
			{
				id: 'devprotocol:clubs:plugin:passports',
				options: [
					{
						key: 'discounts',
						value: [
							{
								payload:
									'0x36a27bd40a9e230d1cbc19143dcde98a898d04a33559a4d2681fb04c739652bd',
								price: {
									yen: 2900,
									usdc: 18.8,
								},
								start_utc: 0,
								end_utc: 8640000000000000,
							},
							{
								payload:
									'0xf1fd783e7519b7162e67944dfcbe44661718bbcd79f2cd941f8e2701f9893b3d',
								price: {
									yen: 36,
									usdc: 0.23760000000000003,
								},
								start_utc: 0,
								end_utc: 8640000000000000,
							},
							{
								payload:
									'0x527e51670240bffb207f7efb52e53c588efadc82db05eda58680e42f82f81c3f',
								price: {
									yen: 225,
									usdc: 1.4925,
								},
								start_utc: 1732045080000,
								end_utc: 1732361880000,
							},
							{
								payload:
									'0xef1907ffea2cf408f2d1c5ec95289402d03859158b2661ad7a2a3bd06dff1f9c',
								price: {
									yen: 150,
									usdc: 0.995,
								},
								start_utc: 1731871860000,
								end_utc: 1732196220000,
							},
						],
					},
					{
						key: 'overrides',
						value: [
							{
								id: '0xc1776ad5c27ad2912919345648682052039f1c384162fa4fa450f0c4c1dd8e32',
								payload:
									'0x4de30164c9ca0d22072dfd3c9f3ac37ac0584a545df8cdcd022f0fe409dc4da8',
								price: {
									yen: 2900,
								},
							},
							{
								id: '0xd551b5b707cc406613b6ae8d8aa5c7ef1e1e1d74ca6ff45f6a398fe022a8ddb2',
								payload:
									'0x36a27bd40a9e230d1cbc19143dcde98a898d04a33559a4d2681fb04c739652bd',
								price: {
									yen: 2900,
								},
							},
							{
								id: '0x5628455f0f44d5465c333f269146ecab9a65f1fc3daf065ddecad8dddd894fc8',
								payload:
									'0xf1fd783e7519b7162e67944dfcbe44661718bbcd79f2cd941f8e2701f9893b3d',
								price: 'not-for-sale',
							},
							{
								id: '0xd9298e4a50776e857328cb8bb5ff5e6c06e465b043f9f8a5c770f2433a86a33a',
								payload:
									'0xdb1f2fc8b73f7c9c88e24feaef28c2df00dfbff98bbc0978ea809654855967a1',
								price: {
									yen: 150,
								},
							},
							{
								id: '0xf68ca98e3a416d8f1d9764302ec52a5d568d05415b4b9a7c486b02c27fbd8c8b',
								payload:
									'0x527e51670240bffb207f7efb52e53c588efadc82db05eda58680e42f82f81c3f',
								price: {
									yen: 225,
								},
							},
							{
								id: '0x1ef103c76e044d0fb8aea8395cb33a6f3ef9f7b61ae463800877638eb7ee0910',
								payload:
									'0xfa15b2b4ca11cab00cfcd69554f95dd223cd71d60a5bff32adbe154bc0421fce',
								price: {
									yen: 300,
								},
							},
							{
								id: '0x8e58353ea9b3a9c7e05c36e1191a61baed4ef3e9f952951fc503b20f06ad0057',
								payload:
									'0xef1907ffea2cf408f2d1c5ec95289402d03859158b2661ad7a2a3bd06dff1f9c',
								price: {
									yen: 150,
								},
							},
							{
								id: '0x04b4c442c42da44de3daec19e205ede9b86ea81abe4fe17dfa35881d7e1bf89b',
								payload:
									'0x8b38bf04949f7bf252d62d35cb40b27082d5cb20f6fe1574ecc7b23a73a54738',
								price: {
									yen: 300,
								},
							},
						],
					},
				],
			},
		],
		offerings: [
			{
				id: '0x04b4c442c42da44de3daec19e205ede9b86ea81abe4fe17dfa35881d7e1bf89b',
				payload: new Uint8Array([245, 85, 191, 2, 203, 245, 5, 164]),
				price: 1.99,
				currency: 'USDC',
				name: 'Cat (Jumping)',
				imageSrc:
					'https://cdn.pixabay.com/photo/2023/04/15/17/19/cat-7928232_1280.png',
				previewImageSrc:
					'https://cdn.pixabay.com/photo/2023/04/15/17/19/cat-7928232_1280.png',
				previewImages: [
					'https://picsum.photos/500',
					'https://picsum.photos/500',
				],
				fee: {
					percentage: 0.3,
					beneficiary: '0xfc4a9e2B406C515415BBcF502A632aefB185A875',
				},
				description: 'A jumping cat passport offering',
				managedBy: 'devprotocol:clubs:plugin:passports',
				i18n: {
					name: {
						en: 'Cat (Jumping)',
						ja: 'ジャンプする猫',
					},
					description: {
						en: 'A jumping cat passport offering',
						ja: 'ジャンプする猫のパスポートオファリング',
					},
				},
			},
			{
				id: '0x8e58353ea9b3a9c7e05c36e1191a61baed4ef3e9f952951fc503b20f06ad0057',
				payload: new Uint8Array([214, 222, 39, 24, 25, 107, 190, 58]),
				price: 1.99,
				currency: 'USDC',
				name: 'Teddy (Jumping)',
				imageSrc:
					'https://cdn.pixabay.com/photo/2013/07/12/17/57/teddy-bear-152700_1280.png',
				previewImageSrc:
					'https://cdn.pixabay.com/photo/2013/07/12/17/57/teddy-bear-152700_1280.png',
				previewImages: [
					'https://picsum.photos/500',
					'https://picsum.photos/500',
				],
				fee: {
					percentage: 0.2,
					beneficiary: '0xfc4a9e2B406C515415BBcF502A632aefB185A875',
				},
				description: 'A jumping teddy passport offering',
				managedBy: 'devprotocol:clubs:plugin:passports',
				i18n: {
					name: {
						en: 'Teddy (Jumping)',
						ja: 'ジャンプするテディ',
					},
					description: {
						en: 'A jumping teddy passport offering',
						ja: 'ジャンプするテディのパスポートオファリング',
					},
				},
			},
			{
				id: '0x1ef103c76e044d0fb8aea8395cb33a6f3ef9f7b61ae463800877638eb7ee0910',
				payload: new Uint8Array([145, 241, 149, 8, 238, 140, 176, 57]),
				price: 1.99,
				currency: 'USDC',
				name: 'Big Buck Bunny',
				i18n: {
					name: {
						en: 'Big Buck Bunny',
						ja: 'ビッグバックバニー',
					},
					description: {
						en: "Big Buck Bunny tells the story of a giant rabbit with a heart bigger than himself. When one sunny day three rodents rudely harass him, something snaps... and the rabbit ain't no bunny anymore! In the typical cartoon tradition he prepares the nasty rodents a comical revenge.\n\nLicensed under the Creative Commons Attribution license\nhttp://www.bigbuckbunny.org",
						ja: 'ビッグバックバニーは、自身よりも大きな心を持つ巨大なウサギの物語です。ある晴れた日に、三匹のげんこつ小動物に無礼にいじめられ、何かが弾け…そしてウサギはもはやウサギではありません！典型的なカートゥーンの伝統に則り、彼は厄介なげんこつ小動物たちに滑稽な復讐を仕掛けます。\n\nクリエイティブ・コモンズ・表示ライセンスの下でライセンスされています\nhttp://www.bigbuckbunny.org',
					},
				},
				imageSrc:
					'https://peach.blender.org/wp-content/uploads/poster_bunny_bunnysize.jpg',
				previewImageSrc: [
					{
						en: 'https://peach.blender.org/wp-content/uploads/poster_bunny_bunnysize.jpg',
						ja: 'https://peach.blender.org/wp-content/uploads/poster_bunny_bunnysize.jpg',
					},
				],
				previewImages: [
					'https://picsum.photos/500',
					'https://picsum.photos/500',
				],
				bundle: [
					new Uint8Array([245, 85, 191, 2, 203, 245, 5, 164]),
					new Uint8Array([214, 222, 39, 24, 25, 107, 190, 58]),
				],
				fee: {
					percentage: 0.17,
					beneficiary: '0xfc4a9e2B406C515415BBcF502A632aefB185A875',
				},
				description:
					"Big Buck Bunny tells the story of a giant rabbit with a heart bigger than himself. When one sunny day three rodents rudely harass him, something snaps... and the rabbit ain't no bunny anymore! In the typical cartoon tradition he prepares the nasty rodents a comical revenge.\n\nLicensed under the Creative Commons Attribution license\nhttp://www.bigbuckbunny.org",
				managedBy: 'devprotocol:clubs:plugin:passports',
			},
			{
				id: '0xf68ca98e3a416d8f1d9764302ec52a5d568d05415b4b9a7c486b02c27fbd8c8b',
				payload: new Uint8Array([31, 228, 98, 220, 141, 82, 223, 67]),
				price: 1.99,
				currency: 'USDC',
				name: 'Elephant Dream',
				imageSrc:
					'https://img.freepik.com/free-vector/sticker-template-elephant-cartoon-character_1308-72465.jpg',
				previewImageSrc:
					'https://img.freepik.com/free-vector/sticker-template-elephant-cartoon-character_1308-72465.jpg',
				previewImages: [
					'https://picsum.photos/500',
					'https://picsum.photos/500',
				],
				fee: {
					percentage: 0.67,
					beneficiary: '0xfc4a9e2B406C515415BBcF502A632aefB185A875',
				},
				description: 'The first Blender Open Movie from 2006',
				managedBy: 'devprotocol:clubs:plugin:passports',
				i18n: {
					name: {
						en: 'Elephant Dream',
						ja: 'エレファントドリーム',
					},
					description: {
						en: 'The first Blender Open Movie from 2006',
						ja: '2006年に制作された初のBlenderオープンムービー',
					},
				},
			},
			{
				id: '0xd9298e4a50776e857328cb8bb5ff5e6c06e465b043f9f8a5c770f2433a86a33a',
				payload: new Uint8Array([6, 245, 225, 148, 239, 10, 61, 216]),
				price: 0.99,
				currency: 'USDC',
				name: 'Puppy dog',
				imageSrc:
					'https://png.pngtree.com/png-clipart/20230405/original/pngtree-cute-cartoon-puppy-dog-sticker-png-image_9029367.png',
				previewImageSrc:
					'https://png.pngtree.com/png-clipart/20230405/original/pngtree-cute-cartoon-puppy-dog-sticker-png-image_9029367.png',
				previewImages: [
					'https://picsum.photos/500',
					'https://picsum.photos/500',
				],
				fee: {
					percentage: 0,
					beneficiary: '0xfc4a9e2B406C515415BBcF502A632aefB185A875',
				},
				description: 'Lil puppy dog',
				managedBy: 'devprotocol:clubs:plugin:passports',
				i18n: {
					name: {
						en: 'Puppy dog',
						ja: '子犬',
					},
					description: {
						en: 'Lil puppy dog',
						ja: 'かわいい子犬',
					},
				},
			},
			{
				id: '0x5628455f0f44d5465c333f269146ecab9a65f1fc3daf065ddecad8dddd894fc8',
				payload: new Uint8Array([128, 109, 149, 55, 45, 195, 31, 238]),
				price: 0.99,
				currency: 'USDC',
				name: 'Baby panda',
				imageSrc:
					'https://i.pinimg.com/736x/a8/d9/ff/a8d9ff1dfda3311eb048c501d9f37b87.jpg',
				previewImageSrc:
					'https://i.pinimg.com/736x/a8/d9/ff/a8d9ff1dfda3311eb048c501d9f37b87.jpg',
				previewImages: [
					'https://picsum.photos/500',
					'https://picsum.photos/500',
				],
				fee: {
					percentage: 0,
					beneficiary: '0xfc4a9e2B406C515415BBcF502A632aefB185A875',
				},
				description: 'Lil baby panda',
				managedBy: 'devprotocol:clubs:plugin:passports',
				i18n: {
					name: {
						en: 'Baby panda',
						ja: '赤ちゃんパンダ',
					},
					description: {
						en: 'Lil baby panda',
						ja: 'かわいい赤ちゃんパンダ',
					},
				},
			},
			{
				id: '0xd551b5b707cc406613b6ae8d8aa5c7ef1e1e1d74ca6ff45f6a398fe022a8ddb2',
				payload: new Uint8Array([193, 82, 14, 188, 164, 119, 44, 36]),
				price: 18.8,
				currency: 'USDC',
				name: 'Passport skin A',
				imageSrc:
					'https://cronuts.digital/wp-content/uploads/2020/04/Artboard-11-1024x724.png',
				previewImageSrc:
					'https://cronuts.digital/wp-content/uploads/2020/04/Artboard-11-1024x724.png',
				previewImages: [
					'https://picsum.photos/500',
					'https://picsum.photos/500',
				],
				fee: {
					percentage: 0.1,
					beneficiary: '0x0000000000000000000000000000000000000000',
				},
				description: 'Skin styling offering',
				managedBy: 'devprotocol:clubs:plugin:passports',
				i18n: {
					name: {
						en: 'Passport skin A',
						ja: 'パスポートスキンA',
					},
					description: {
						en: 'Skin styling offering',
						ja: 'スキンスタイリング提供',
					},
				},
			},
			{
				id: '0xc1776ad5c27ad2912919345648682052039f1c384162fa4fa450f0c4c1dd8e32',
				payload: new Uint8Array([127, 225, 94, 186, 141, 172, 250, 142]),
				price: 18.8,
				currency: 'USDC',
				name: 'Passport Skin B',
				imageSrc:
					'https://opspl.com/wp-content/uploads/2023/10/logo-2582747_1280.png',
				previewImageSrc:
					'https://opspl.com/wp-content/uploads/2023/10/logo-2582747_1280.png',
				previewImages: [
					'https://picsum.photos/500',
					'https://picsum.photos/500',
				],
				fee: {
					percentage: 0,
					beneficiary: '0x0000000000000000000000000000000000000000',
				},
				description: 'Passport skin offering',
				managedBy: 'devprotocol:clubs:plugin:passports',
				i18n: {
					name: {
						en: 'Passport Skin B',
						ja: 'パスポートスキンB',
					},
					description: {
						en: 'Passport skin offering',
						ja: 'パスポートスキン提供',
					},
				},
			},
		],
	})
