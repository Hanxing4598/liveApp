/**
 * 封装弹窗对象
 */
class alert {
	constructor() {

	}
	/**
	 * call 确认回调
	 * cancel 取消回调
	 * content 提示内容
	 * showCancel 是否显示取消按钮
	 */
	showModal({
		call,
		cancel,
		content,
		showCancel,
		confirmText = '好',
		title = '提示',
		cancelText = '取消'
	}) {
		uni.showModal({
			title: title,
			cancelText:cancelText,
			content: content,
			confirmColor: '#ff617b',
			showCancel: showCancel,
			confirmText: confirmText,
			success(res) {
				if (res.confirm) {
					if (call) {
						call()
					}
				} else {
					if (cancel) {
						cancel()
					}
				}
			}
		})
	}

	/**
	 * title 提示内容
	 * icon 图标类型
	 * image 自定义图标（参数：图片路径）
	 */
	showToast({
		title,
		icon = 'success',
		image,
		callback = () => {}
	}) {
		uni.showToast({
			// mask: true,
			title: title,
			image: image,
			icon: icon
		})
		setTimeout(() => {
			callback()
		}, 1500)
	}

	/**
	 * 前往登录
	 */
	$toLogin() {
		this.showModal({
			content: '先登录吧',
			call() {
				uni.navigateTo({
					url: '/pages/login/login'
				})
			}
		})
	}

	/**
	 * 下载App
	 */
	$downLoadApp() {
		this.showModal({
			content: '网页端不支持该功能哦！\n下载App即可享用该功能。是否前往下载？',
			confirmText: '去下载',
			call() {
				//	下载地址
			}
		})
	}
}

export default new alert()
