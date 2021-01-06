import alert from '@/common/alert/alert.js'
const token = ({
	success = ()=>{},
	fail = () => {
		alert.$toLogin()
	}
}) => {
	let token = uni.getStorageSync('token')
	token ? success(token) : fail('未登录')
}

export default token
