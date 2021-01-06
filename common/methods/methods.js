import alert from '@/common/alert/alert'
/**
 * 封装一些常用的公共方法
 */
class methods {
	constructor() {

	}
	/**
	 * 执行上一个页面的方法
	 * @param {Object} callback		回调函数，指定执行对应的钩子函数
	 * 常用于表单操作，返回时进行数据的提前更新
	 */
	$beforePageDrive(callback) {
		var pages = getCurrentPages();
		if (pages.length > 1) {
			var beforePage = pages[pages.length - 2];
			callback(beforePage.$vm)
		}
	}

	/**
	 * 调用微信分享
	 * 支持微信朋友圈、微信好友
	 * 图文分享、图片分享、视频分享
	 */
	$share({
		type,
		title,
		summary,
		href,
		mediaUrl,
		imageUrl,
		success
	}) {
		//#ifdef H5
		alert.showModal({
			content: '网页端不支持分享操作哦！\n下载App即可享用该功能。是否前往下载？',
			call() {

			}
		})
		//#endif

		//#ifdef APP-PLUS
		uni.showActionSheet({
			itemList: ['微信好友', '朋友圈'],
			success({
				tapIndex
			}) {
                uni.showLoading({
                    title: '请稍后...'
                })
				switch (tapIndex) {
					case 0:
						uni.share({
							provider: 'weixin',
							scene: 'WXSceneSession',
							type: type,
							href: href,
							title: title,
							summary: summary,
							mediaUrl:mediaUrl,
							imageUrl: imageUrl,
							success(res) {
								success(res)
							},
							fail(res) {
								console.log(res);
							},
                            complete() {
                                uni.hideLoading()
                            }
						})
						break;
					case 1:
						uni.share({
							provider: 'weixin',
							scene: 'WXSenceTimeline',
							type: type,
							title: title,
							href: href,
							imageUrl: imageUrl,
							summary: summary,
							success(res) {
								success(res)
							},
                            complete() {
                                uni.hideLoading()
                            }
						})
				}
			}
		})
		//#endif
	}

	/**
	 * 超链接方法
	 * @param {Object} url		//	跳转地址
	 */
	$link(url) {
		// #ifdef APP-PLUS
		plus.runtime.openURL(url)
		// #endif
		// #ifdef H5
		window.open(url)
		// #endif
	}

	/**
	 * 封装支付请求参数
	 */
	$callPay() {
		const self = this
		return new Promise((reslove, reject) => {
			let pays = [],
				payWayConst,
				tradeType
			//#ifdef H5
			var ua = window.navigator.userAgent.toLowerCase();
			if (ua.match(/MicroMessenger/i) == 'micromessenger') {
				//在微信中打开
				pays = ['微信支付']
				payWayConst = 'JS'
			} else {
				pays = ['微信支付', '支付宝支付']
				payWayConst = 'H5'
			}
			//#endif

			//#ifdef APP-PLUS
			pays = ['微信支付', '支付宝支付']
			payWayConst = 'APP'
			//#endif

			//#ifdef MP-WEIXIN
			pays = ['微信支付']
			payWayConst = 'APPLET'
			//#endif
			// pays.push('余额支付')
			uni.showActionSheet({
				itemList: pays,
				success({
					tapIndex
				}) {
					if (pays[tapIndex] == '微信支付') {
						tradeType = 'WXPAY'
					}
					if (pays[tapIndex] == '支付宝支付') {
						tradeType = 'ALIPAY'
					}
					// if(pays[tapIndex] == '余额支付'){
					// 	$http.request({
					// 		url:''
					// 	})
					// 	return
					// }
					reslove({
						payWayConst,
						tradeType
					})
				},
				fail(error) {
					reject(error)
				}
			})
		})
	}

	$payMent({
		payType,
		orderInfo,
		paymentData,
		success
	}) {
		// #ifdef APP-PLUS
		/* if (payType == 'WXPAY') {
			uni.showToast({
				title: '暂不支持该支付！',
				icon: 'none'
			})
			return
		} */
        
        console.log(orderInfo, '微信参数')
		uni.requestPayment({
			provider: payType.toLowerCase(),
			orderInfo: orderInfo,
			success: (e) => {
				console.log("success", e);
				success(e)
				uni.showToast({
					title: '支付成功！'
				})
			},
			fail: (e) => {
				console.log("fail", e);
				uni.showToast({
					title: '支付失败！',
					icon: 'none'
				})
			}
		})
		// #endif

		//#ifdef MP-WEIXIN
		uni.requestPayment({
			timeStamp: paymentData.timeStamp,
			nonceStr: paymentData.nonceStr,
			package: paymentData.package,
			signType: 'MD5',
			paySign: paymentData.paySign,
			success: (e) => {
				console.log("success", e);
				success(e)
			},
			fail: (e) => {
				console.log("fail", e);
			}
		})
		//#endif
	}
    
    toDownApp(content) {
        alert.showModal({
        	content: content + '\n下载App即可享用该功能。是否前往下载？',
        	call() {
        
        	}
        })
    }
}

export default new methods()
