import store from '@/store/index.js'
const environment = uni.getStorageSync('environment')
export default environment ? environment : store.state.formalUrl
