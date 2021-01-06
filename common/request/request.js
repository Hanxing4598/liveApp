import url from './url.js'
import store from '@/store/index.js'
import alert from '@/common/alert/alert.js'
/**
 * 封装请求对象
 */
class request {
	constructor() {
		this.url = url
		// 小鹿商城url地址
		this.shopUrl = store.state.shopUrl
	}

	baseURL() {
		return this.shopUrl
	}

	/**
	 * url 请求地址（控制器路径）
	 * data 传递参数
	 * options 请求头配置
	 * type 请求类型
	 */
	//	返回的是Promise对象
	request({
		url = "",
		data = {},
		options = {},
		type = "POST"
	}) {
		return new Promise((reslove, reject) => {
			uni.request({
				url: this.url + url,
				method: type,
				data: data,
				header: options,
				complete() {
					store.commit('request_hide_loading');
				},
				success({
					data
				}) {
					if (data.code == 200 || !data.code) {
						reslove(data) //	响应成功
						// uni.hideToast()
					} else {
						if (data.code == 203) {
							alert.showModal({
								content: '登录已过期，请重新登录！',
								call() {
									uni.navigateTo({
										url: '/pages/login/login'
									})
								}
							})
							return
						}
						reject(data)
						uni.showToast({
							title: data.message,
							icon: 'none'
						})
					}
				},
				fail(res) {
					reject(res)
					uni.showToast({
						title: "请求错误！",
						icon: 'none'
					})
				}
			})
		})
	}

	shopRequest (url, obj = { data: {} }) {
		const that = this
		obj.showLoading = typeof obj.showLoading === 'undefined' ? true : obj.showLoading
		// 默认显示 loading
		obj.showLoading && wx.showLoading({
			title: '加载中',
			mask: true
		})
		const method = obj.method || 'GET'

		return new Promise((resolve, reject) => {
			let apiurl = that.shopUrl + url
			let sessionid = `SESSION=${wx.getStorageSync('sessionid')}`
			let cartbuy = `buyer_cart=${wx.getStorageSync('buyer_cart')}`
			let cookie = sessionid
			if (cartbuy) {
				cookie += ';' + cartbuy
			}
			wx.request({
				url: apiurl,
				method: method,
				data: obj.data,
				header: {
					'Authorization': uni.getStorageSync('token') || '',
					Accept: 'application/json',
					'X-Requested-With': 'XMLHttpRequest',
					'Content-Type':
						method === 'GET'
							? 'application/json' // GET 请求格式用 application/json
							: 'application/x-www-form-urlencoded' // POST 请求格式用 application/x-www-form-urlencoded
				},
				success(res) {
					wx.hideLoading()
					// 返回数据
					resolve(res.data, res)

					// 当前接口是否需要登录，如果需要登录并且当前处于未登录状态跳转登录页
					// 跟后端协商好需要登录的接口返回的字段是什么
					// if (res.data.status === 10001 && !authorized()) {
					//   // 跳转登录页
					//   wx.redirectTo({
					//     url: '/pages/login'
					//   })
					// }

					// 如果需要对接口的异常弹窗提示移可以写在这里
				},
				fail(res) {
					wx.hideLoading()
					reject(res)
				},
				complete(res) {
					// wx.hideLoading()
					store.commit('request_hide_loading');
					// 是否需要做404错误拦截
					if (res.statusCode === 404) {
					}
					// 未登录
					// let routes = getCurrentPages()
					// console.log(routes)
					// let routeLen = routes.length - 1

					// let currentPage = getApp().globalData.appOptions.path
					// let currentPage = getCurrentPages()[0].route
					if (res.statusCode === 401) {
						// if (currentPage === 'pages/me/main') {
						//   return
						// }
						wx.navigateTo({
							url: '/pages/login/login'
						})
					}
				}
			})
		})
	}
	/* eslint-disable*/
	get = url => {
		return this.shopRequest(url)
	}

	fetch = url => {
		return this.shopRequest(url)
	}

	post = (url, obj = {}) => {
		obj['method'] = 'POST'
		return this.shopRequest(url, obj)
	}
}
export default new request()
