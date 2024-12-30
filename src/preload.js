const { contextBridge } = require('electron');
const puppeteerExtra = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const os = require('os')

const userName = os.userInfo().username
const pageLink = 'https://vk.com/al_im.php?sel=c13'
const executablePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const userDataDir = `C:/Users/${userName}/AppData/Local/Google/Chrome/User Data/Default/Network`

puppeteerExtra.use(StealthPlugin());

const SELECTORS = {
	WB: {
		title: '.product-page__title',
		image: '.slide__content img',
	},
	OZON: {
		title: '[data-widget] h1',
		image: '[data-widget="webGallery"] > div > div > div > * ~ div img',
	},
	OZON_ALT: {
		title: '[data-widget="webOutOfStock"] > div > div > div > div > div > p',
		image: '[data-widget="webOutOfStock"] > div > div > div > div > div > img',
	},
	YANDEX: {
		title: '#cardContent h1',
		image: '[role="tablist"] img',
	},
	SUNLIGHT: {
		title: '',
		image: '',
	},
}

contextBridge.exposeInMainWorld('electron', {
	getUsers: async () => {

		async function getProductInfo(browser, messages, SELECTORS) {
			const gatheredInfo = [];
			const incognitoBrowser = await browser.createIncognitoBrowserContext();
			const newPage = await incognitoBrowser.newPage();

			for (const msg_content of messages) {
				if (msg_content.msg.length !== 0) {
					for (const msg_item of msg_content.msg) {
						try {
							await newPage.setJavaScriptEnabled(true);
							await newPage.setDefaultNavigationTimeout(0);
							await newPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36');
							await newPage.evaluateOnNewDocument(() => {
								Object.defineProperty(navigator, 'webdriver', {
									get: () => false,
								});
							});
							// await newPage.setViewport({
							// 	width: 1920,
							// 	height: 1080,
							// });

							await newPage.goto(msg_item.link);
							// ================== WB =========================
							if (msg_item.link.match(/wildberries/)) {
								await newPage.waitForSelector('h1');
								msg_item.H1 =
									(await newPage.evaluate(
										(sel) =>
											document.querySelector(sel)?.textContent,
										SELECTORS.WB.title
									)) || 'Товар не найден';
								msg_item.itemImg =
									(await newPage.evaluate(
										(sel) =>
											document.querySelector(sel)?.src,
										SELECTORS.WB.image
									)) || 'Нет изображения';
							}
							//==================================================
							// ================== OZON =========================
							else if (msg_item.link.match(/ozon/)) {
								try {
									await newPage.waitForSelector(
										'[data-widget="webGallery"]',
										{ timeout: 5000 }
									);
								} catch (error) { }
								msg_item.H1 =
									(await newPage.evaluate(
										(sel, sel_1) =>
											document.querySelector(sel)?.textContent ||
											document.querySelector(sel_1)?.textContent,
										SELECTORS.OZON.title,
										SELECTORS.OZON_ALT.title
									)) || 'Товар не найден';
								msg_item.itemImg =
									(await newPage.evaluate(
										(sel, sel_1) =>
											document.querySelector(sel)?.src?.replace(/wc\d*/gm, 'wc1000') ||
											document.querySelector(sel_1)?.src?.replace(/wc\d*/gm, 'wc1000'),
										SELECTORS.OZON.image,
										SELECTORS.OZON_ALT.image
									)) || 'Нет изображения';
							}
							//==================================================
							// ================== SUNLIGHT =====================
							else if (msg_item.link.match(/sunlight/)) {
								try {
									await newPage.waitForSelector('.supreme-product-card__slider-block', {
										timeout: 5000,
									});
								} catch (error) { }
								msg_item.H1 =
									(await newPage.evaluate(
										() => document.querySelector('h1')?.textContent
									)) || 'Товар не найден';
								msg_item.itemImg =
									(await newPage.evaluate(
										() =>
											document.querySelector(
												'.supreme-product-card-slider__item-image > img'
											)?.src
									)) || 'Нет изображения';
							}
							//==================================================
							// ================== YANDEX =======================
							else if (msg_item.link.match(/market.yandex/)) {
								try {
									await newPage.waitForSelector('#ProductImageGallery', {
										timeout: 5000,
									});
								} catch (error) { }
								msg_item.H1 =
									(await newPage.evaluate(
										(sel) =>
											document.querySelector(sel)?.textContent,
										SELECTORS.YANDEX.title
									)) || 'Товар не найден';
								msg_item.itemImg =
									(await newPage.evaluate(
										(sel) =>
											document.querySelector(sel)?.src,
										SELECTORS.YANDEX.image
									)) || 'Нет изображения';
							}
							//================================================
						} catch (error) {
							console.error('Ошибка по ссылке: ', msg_item.link, error);
						}
					}
					gatheredInfo.push(msg_content);
				} else gatheredInfo.push(msg_content);
			}

			return gatheredInfo;
		}

		async function processMessages(page, selector) {
			const messages = await page.$$eval(selector, (messages) => {
				const parsedMessagesArr = []

				for (const message of messages) {
					const user_id = message.querySelector('.ForwardedMessageNew .ForwardedMessageNew__userName')?.href.trim().slice(62) || "нет ID"
					const user_name = message.querySelector('.ForwardedMessageNew .ForwardedMessageNew__userName')?.textContent.trim() || "нет имени"
					const date = ""
					const avatar = message.querySelector('.ForwardedMessageNew .MEAvatar__imgWrapper img')?.src || "нет фото"

					const msg = () => {
						const msgArray = [...message.querySelectorAll('.im-mess--text')].map(message_content => {
							const linkSelector = 
							`a:not(.mail_link,
							.im_browse_msg_images a,
							[aria-label="фотография"],
							[onclick],
							.im_grid ,
							.page_post_sized_thumbs clear_fix,
							.im-mess-stack--lnk,
							.media_link__media,
							.media_link__title,
							.media_link__subtitle,
							.thumbed_link__thumb,
							.thumbed_link__title,
							.thumbed_link__subtitle,
							.link)`
							const H1 = ''
							const itemImg = ''
							const linkElement = message_content.querySelector(linkSelector)
								?.textContent || message_content.querySelector('.media_link__media')
								?.href || message_content.querySelector('.mail_link')
								?.href || message_content.querySelector('a.thumbed_link__title')
								?.href || ''
							const link = decodeURIComponent(linkElement.replace(/.*to=([^&]*)(&.*|$)/, '$1'))
							if (link === '' || !link.match(/wildberries|ozon|sunlight|market.yandex/)) {
								return null
							} else return {
								prod_id: user_id,
								link,
								H1,
								itemImg,
								isActive: false
							}
						})
						return msgArray.filter(item => item != null)
					}
					const parsedMessages = {
						user_id: user_id,
						user_name: user_name,
						date: date,
						msg: msg(),
						avatar: avatar,
						isActive: false
					}
					parsedMessagesArr.push(parsedMessages)
				}
				return parsedMessagesArr
			})
			return messages
		}

		async function getUserData(messages) {
			const usersObj = messages.reduce((acc, obj) => {

				if (!acc[obj.user_id]) {
					acc[obj.user_id] = { user_id: obj.user_id }
				}

				for (const key in obj) {
					if (key !== 'id') {
						if (Array.isArray(obj[key])) {
							acc[obj.user_id][key] = acc[obj.user_id][key] ? acc[obj.user_id][key].concat(obj[key]) : obj[key]
						} else {
							acc[obj.user_id][key] = obj[key]
						}
					}
				}
				return acc
			}, {})

			const users = Object.values(usersObj)

			return users
		}

		try {
			const browser = await puppeteerExtra.launch({
				headless: false,
				executablePath,
				defaultViewport: null,
				userDataDir
			})

			const [page] = await browser.pages()

			await page.goto(pageLink)
			for (let i = 0; i < 1; i++) {
				await page.evaluate(() => window.scrollTo(0, 0))
				await page.waitForTimeout(5000 + i * 1000)
			}

			let messages = await processMessages(page, '.im-mess-stack_no-tools')
			//.ConvoMessageWithoutBubble__wrapper
			//ConvoStack__content
			//.im-mess-stack_no-tools
			messages = await getProductInfo(browser, messages, SELECTORS)
			const users = await getUserData(messages)

			// await browser.close()

			return users;
		} catch (error) {
			console.error('Произошла ошибка:', error)
		}
	}
})
