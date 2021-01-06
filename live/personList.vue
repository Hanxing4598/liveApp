<template>
    <view>
        <view class="liver-info-wrap-right">
            <view class="liver-info-avatar-wrap">
                <image class="liver-info-avatar-item" :src="item.avatar ? item.avatar : '../../static/logo.png'" v-for="item in visitorData.showList" @click="showPersonInfo(item.id)"></image>
                <text class="liver-info-avatar-item liver-info-avatar-last" @click="showVisitorList">{{visitorData.total}}</text>
            </view>
        </view>
        
        <uni-popup ref="personTopList" type="bottom">
            <scroll-view scroll-y class="top-list">
                <view class="top-list-item" v-for="(item,index) in visitorData.list" :key="index" >
                    <view class="top-list-left" @click="showPersonInfo(item.id)" >
                        <image class="top-list-head" :src="item.avatar" mode="aspectFill"></image>
                        <view class="top-list-info">
                            <view class="top-list-name-wrap">
                                <text class="top-list-name">{{item.nickname}}</text><view v-if="item.sex" :class="['top-list-person-avatar-icon', 'person-avatar-icon', 'person-avatar-icon-'+item.sex]"><image class="person-avatar-img" :src="sexImg[item.sex]" mode="widthFix"></image></view>
                            </view>
                            <text class="top-list-text">{{item.giftNum}}礼物</text>
                        </view>
                    </view>
                    <view class="top-list-right" v-if="item.id">
                        <!-- <uni-tag v-if="myId!=item.id" :inverted="!item.follow" @click="follow(item)" :text="item.follow?'取关': '+关注'" size="small"
                         type="primary" /> -->
                         <!-- <text :class="['top-list-tag', item.follow ? 'top-list-followed':'']" @click.stop="follow(item)">{{item.follow?'已关注': '关注'}}</text> -->
                         <!-- 如果是好友，可以私信 -->
                         <uni-icons class="top-list-chat-icon" style="margin-top: 10rpx;" type="chatbubble" size="20" color="#999" @tap="toChat(item)"></uni-icons>
                    </view>
                </view>
            </scroll-view>
        </uni-popup>
        <!-- 点击用户资料 -->
        <uni-popup ref="personInfo" type="bottom">
            <view class="person-container">
                <view class="person-wrapper">
                    <view class="person-wrapper-bg"></view>
                    <view class="person-content">
                        <view class="person-content-info">
                            <view class="person-avatar-wrap">
                                <image class="person-avatar" :src="personInfo.data.avatar" mode="aspectFill"></image>
                                <view :class="['person-avatar-icon', 'person-avatar-icon-'+personInfo.data.sex]"><image class="person-avatar-img" :src="sexImg[personInfo.data.sex]" mode="widthFix"></image></view>
                            </view>
                            <text class="person-name">{{personInfo.data.nickname}}</text>
                            <view class="person-sub-name-wrap"><text class="person-sub-name">ID:{{personInfo.data.customerNo}}</text><text class="person-sub-name-text">{{personInfo.data.liveCity}}</text></view>
                            <view class="person-tag-wrap">
                                <view class="person-tag-item person-tag-item-1"><uni-icons type="star-filled" color="#fff" size="12"></uni-icons><text class="person-tag-item-text">1</text></view>
                                <view class="person-tag-item person-tag-item-2"><image class="person-tag-img" src="../../static/live/level/l1.png" mode="aspectFill"></image><text class="person-tag-item-text">1</text></view>
                            </view>
                            <text class="person-text">{{personInfo.data.description}}</text>
                        </view>
                        <view class="person-list-container">
                            <view class="person-title">
                                <view class="person-title-text-wrap" :class="{'person-title-text-active': personInfo.current === 1}" @click="changePersonType(1)"><text class="person-title-text">作品</text><text class="person-title-num">{{personInfoJson[1].total}}</text></view>
                                <view class="person-title-text-wrap" :class="{'person-title-text-active': personInfo.current === 2}" @click="changePersonType(2)"><text class="person-title-text">喜欢</text><text class="person-title-num">{{personInfoJson[2].total}}</text></view>
                                <view class="person-title-text-wrap" :class="{'person-title-text-active': personInfo.current === 3}" @click="changePersonType(3)"><text class="person-title-text">随便看</text><text class="person-title-num">{{personInfoJson[3].total}}</text></view>
                                <view class="person-title-text-wrap" :class="{'person-title-text-active': personInfo.current === 4}" @click="changePersonType(4)"><text class="person-title-text">游记</text><text class="person-title-num">{{personInfoJson[4].total}}</text></view>
                                <view class="person-title-text-wrap" :class="{'person-title-text-active': personInfo.current === 5}" @click="changePersonType(5)"><text class="person-title-text">约伴</text><text class="person-title-num">{{personInfoJson[5].total}}</text></view>
                            </view>
                            <view class="person-list-wrap">
                                <scroll-view scroll-y @scrolltolower="personScrolled" class="person-video-list" v-if="personInfo.current === 1 || personInfo.current === 2">
                                    <view class="person-video" @tap="previewVideo(item,index)" v-for="item in personInfo.list">
                                    	<view class="person-video-box">
                                            <image class="person-video-img" :src="item.coverUrl==''?'/static/logo.png':item.coverUrl" mode="aspectFill"></image>
                                    		<view class="person-video-bot">
                                    			<uni-icons color="#ffffff" type="heart"></uni-icons>
                                    			<text class="person-video-text" >{{item.praiseNum}}</text>
                                    		</view>
                                    	</view>
                                    </view>
                                </scroll-view>
                            </view>
                        </view>
                    </view>
                    <view class="person-footer">
                        <view class="person-footer-item" @click="follow(personInfo.data)">
                            <uni-icons type="plusempty" size="24" color="#41a0fc" v-if="!personInfo.data.follow"></uni-icons>
                            <text class="person-footer-item-text person-footer-item-follow-text">{{personInfo.data.follow?'取关':'关注'}}</text>
                        </view>
                        <view class="person-footer-item" @click="toChat(personInfo.data)">
                            <text class="person-footer-item-text">私信</text>
                        </view>
                        <view class="person-footer-item" @click="toHome">
                            <text class="person-footer-item-text">主页</text>
                        </view>
                    </view>
                </view>
            </view>
        </uni-popup>
        
        <!-- 私信 -->
        <uni-popup ref="priviteMessage" type="bottom">
            <scroll-view scroll-y @scrolltolower="messageBot" class="message-wrapper">
                <MessageList @read="readMsg"></MessageList>
            </scroll-view>
        </uni-popup>
        
        <uni-popup ref="chat" type="center">
            <view class="chat-view-wrap">
                <view class="chat-header">
                    <text class="chat-header-text">{{currentChat.nickname || currentChat.nickName}}</text>
                </view>
                <ChatView v-if="showChat" style="top: 80rpx"></ChatView>
            </view>
        </uni-popup>
    </view>
</template>

<script>
    import $http from '@/common/request/request'
    import API from '../../utils/api.js'
    import ChatView from './chatView.vue'
    import token from '@/common/token/token'
    import MessageList from './messageList.vue'
    export default {
        props: ['liveId'],
        data () {
            return {
                visitorPage: 1,
                visitorData: {
                    page: 1,
                    list: [],
                    showList: []
                },
                personInfo: {
                    current: 1, // 默认作品
                    data: [],
                    list: []
                },
                personInfoJson: {
                    1: {
                        data: {
                            current: 1,
                            queryType: 1,
                            size: 9
                        }
                    },
                    2: {
                        data: {
                            current: 1,
                            queryType: 2,
                            size: 9
                        }
                    },
                    3: {
                        url: API.casualLookList,
                        data: {
                            currentPage: 1,
                            pageSize: 5,
                            type: 0
                        }
                    },
                    4: {
                        url: API.travelNoteList,
                        data: {
                            currentPage: 1,
                            pageSize: 5,
                            type: 1
                        }
                    },
                    5: {
                        url: API.partnerList,
                        data: {
                            currentPage: 1,
                            pageSize: 5,
                            type: 1
                        }
                    }
                },
                showChat: false,
                currentChat: {},
                sexImg: { 1: '../../static/sex_1.png', 2: '../../static/sex_2.png' }
            }
        },
        created() {
            this.defaultPersonJson = Object.assign({}, this.personInfoJson, {})
            // 循环查看观看列表
            this.visitorTimer = setInterval(() => {
                this.getVistorList(1)
            }, 4000)
            this.getVistorList(1)
        },
        destroyed() {
            if (this.visitorTimer) {
                clearInterval(this.visitorTimer)
            }
        },
        components: {
            ChatView,
            MessageList
        },
        methods: {
            readMsg(item) {
                this.toChat(item)
            },
            messageBot() {
                MessageList.methods.bottom()
            },
            toHome() {
                uni.navigateTo({
                    url: '/pages/liveBroadcast/userInfo/userInfo?userId=' + this.personInfo.data.id
                })
            },
            showMessageList() {
                // MessageList.methods.initList()
                this.$refs.priviteMessage.open()
            },
            follow(item) {
            	let self = this
            	token({
            		success(token) {
            			if (item.follow) {
            				$http.request({
            					url: 'userFollow/delete/' + item.id,
            					options: {
            						'Authorization': token
            					}
            				}).then(({
            					message
            				}) => {
            					self.alert.showToast({
            						title: message
            					})
            					self.$set(item, 'follow', false)
            				})
            			} else {
            				$http.request({
            					url: 'userFollow/push',
            					data: {
            						followUserId: item.id,
            						type: '10A'
            					},
            					options: {
            						'Authorization': token
            					}
            				}).then(({
            					message
            				}) => {
            					self.$set(item, 'follow', true)
            				})
            			}
            		}
            	})
            },
            toChat(item) {
                this.currentChat = item
                uni.setStorageSync('chatTarget', item)
                let self = this
                this.$nextTick(function(){
                    self.showChat = true
                    self.$refs.chat.open()
                })
            },
            personScrolled() {
                let props = this.personInfo.current === 1 || this.personInfo.current === 2 ? 'current' : 'currentPage'
                this.personInfoJson[this.personInfo.current].data[props]++
                this.queryPersonList(this.personInfo.current)
            },
            /**
             * 展示观众列表
             */
            showVisitorList() {
                // todo
                let self = this
                this.visitorData.page = 1
                this.visitorData.list = []
                this.getVistorList(2, () => {
                    this.$nextTick(function(){
                        self.$refs.personTopList.open()
                    })
                })
            },
            /**
             * @param {Object} type 1 -> 循环查询头像, 2 -> 分页列表
             */
            getVistorList(type, fn) {
                let params = {}
                if (type === 1) {
                    params = {
                        current: 1,
                        size: 3
                    }
                } else {
                    params = {
                        current: this.visitorData.page,
                        size: 10
                    }
                }
                params.liveId = this.liveId
                let token = uni.getStorageSync('token')
                $http.request({
                	url: 'live/visitorList',
                	data: params,
                    options: {
                    	'Authorization': token
                    }
                }).then(result => {
                	uni.hideLoading()
                	/* if (callback) {
                		callback(result)
                		return
                	} */
                    if (type === 1) {
                        this.visitorData.showList = result.records
                        this.visitorData.total = result.total
                    } else {
                        this.visitorData.list = [...this.visitorData.list, ...result.records]
                    }
                    // this.personInfoJson[this.personInfo.current].total = 
                    fn && fn(result.records)
                })
            },
            changePersonType(type) {
                this.personInfo.current = type
                let props = type === 1 || type === 2 ? 'current':'currentPage'
                this.personInfoJson[type].data[props] = 1
                this.personInfo.list = []
                // this.personInfoJson = Object.assign({}, this.defaultPersonJson, {})
                this.queryPersonList(this.personInfo.current)
            },
            queryPersonList(current) {
                uni.showLoading({
                	title: '加载中..'
                })
                if (current === 1 || current === 2) {
                    this.personInfoJson[current].data.userId = this.personInfo.data.id
                    $http.request({
                    	url: 'vod/query',
                        // 合并对象
                    	data: Object.assign({}, {queryType: current,userId: this.personInfo.data.customerId}, this.personInfoJson[current].data)
                    }).then(result => {
                    	uni.hideLoading()
                    	/* if (callback) {
                    		callback(result)
                    		return
                    	} */
                    	this.personInfo.list = [...this.personInfo.list, ...result.records]
                        this.personInfoJson[current].total = result.total
                    })
                } else {
                    this.personInfoJson[current].data.userId = this.personInfo.data.id
                    $http.post(this.personInfoJson[current].url, {
                        data: Object.assign({}, {userId: this.personInfo.data.customerId}, this.personInfoJson[current].data)
                      }).then(res => {
                          uni.hideLoading()
                        if (res.code === 0) {
                            // 随便看看
                          if (current === 3) {
                              res.result.data.forEach(item => {
                                item.imgUrl = item.imgUrl.split(',')
                              })
                          } else if (current === 4) {
                              // 游记
                              let imgReg = /<img.*?(?:>|\/>)/gi
                              let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i
                              res.result.data.forEach((item) => {
                                item.photo = `${item.urlPrefix}${item.photo}`
                                // 获取第一张图片作为主图
                                let arr = item.content.match(imgReg)
                                if (arr && arr[0]) {
                                  let src = arr[0].match(srcReg)
                                  this.$set(item, 'img', src[1]) // src[1]为src地址
                                }
                                item.content = item.content.replace(/<img.*?(?:>|\/>)/gi, '') // 列表内容不展示图片
                              })
                          } else if (current === 5) {
                              // 约伴
                              res.result.data.forEach((item) => {
                                item.typeImgUrl = item.typeImgUrl.split(',')[0]
                              })
                          }
                          this.personInfoJson[current].total = res.result.total
                          this.personInfo.list = [...this.personInfo.list, ...res.result.data]
                        }
                    })
                }
            },
            showPersonInfo(id) {
                if (!id) {return}
                let self = this
                $http.request({
                	url: 'customer/userById',
                	data: {
                		followUserId: id,
                		userId: uni.getStorageSync('userInfo').id
                	}
                }).then(result => {
                    this.personInfo.data = result
                    let self = this
                    this.$nextTick(function(){
                        self.$refs.personInfo.open()
                    })
                    // 初始化参数
                    this.personInfo.current = 1
                    this.personInfo.list = []
                    this.personInfoJson = Object.assign({}, this.defaultPersonJson, {})
                    this.queryPersonList(1)
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .liver-info-avatar-wrap {
        flex-direction: row;
    }
    .liver-info-avatar-item {
        width: 70rpx;
        height: 70rpx;
        border-radius: 50%;
        margin-left: 8rpx;
    }
    .liver-info-avatar-last {
        flex-direction: row;
        color: #fff;
        text-align: center;
        line-height: 70rpx;
        background-color: rgba($color: #000000, $alpha: 0.3);
        font-size: 20rpx;
    }
    
    .person-container {
        height: 1000rpx;
    }
    
    .person-wrapper {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 1000rpx;
    }
    
    .person-wrapper-bg {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 925rpx;
        border-radius: 20rpx;
        background-color: #fff;
    }
    
    .person-avatar-wrap {
        position: relative;
        width: 150rpx;
        height: 150rpx;
        z-index: 99999
    }
    
    .person-avatar-img {
        width: 18rpx;
        height: 18rpx;
        // #ifdef H5
        background: none;
        // #endif
    }
    
    .person-avatar {
        width: 150rpx;
        height: 150rpx;
        border-radius: 50%;
    }
    
    .person-avatar-icon {
        position: absolute;
        right: 0;
        bottom: 0;
        justify-content: center;
        align-items: center;
        width: 32rpx;
        height: 32rpx;
        border-radius: 50%;
    }
    .person-avatar-icon-1 {
        background-color: #20cafd;
    }
    .person-avatar-icon-2 {
        background-color: #fe4493;
    }
    
    .person-content-info {
        flex-direction: column;
        align-items: center;
    }
    
    .person-tag-wrap {
        flex-direction: row;
    }
    .person-tag-item {
        flex-direction: row;
        align-items: center;
        padding: 0 10rpx;
        height: 30rpx;
        margin: 0 12rpx;
        border-radius: 40rpx;
    }
    
    .person-tag-item-1 {
        background-color: #b2f205;
    }
    
    .person-tag-item-2 {
        background-color: #83bbf5;
    }
    
    .person-tag-img {
        width: 24rpx;
        height: 24rpx;
    }
    
    .person-tag-item-text {
        margin-left: 5rpx;
        color: #fff;
        font-size: 18rpx;
    }
    
    .person-name {
        color: #333333;
        font-size: 32rpx;
        margin: 16rpx 0;
    }
    
    .person-sub-name-wrap {
        flex-direction: row;
    }
    
    .person-sub-name {
        margin: 0 0 24rpx;
        font-size: 28rpx;
        color: #666666;
    }
    
    .person-sub-name-text {
        color: #666;
        font-size: 28rpx;
        margin-left: 30rpx;
    }
    
    .person-text {
        margin-top: 26rpx;
        color: #333333;
        font-size: 24rpx;
    }
    
    .person-title {
        flex-direction: row;
        border-bottom-width: 1rpx;
        border-bottom-color: #dcdcdc;
    }
    
    .person-title-text-wrap {
        height: 62rpx;
        flex: 1;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
    
    .person-title-text-active {
        border-bottom-width: 4rpx;
        border-bottom-color: #41a0fc;
    }
    
    .person-title-num {
        margin-left: 12rpx;
        font-weight: bold;
        font-size: 26rpx;
    }
    
    .person-title-text {
        font-size: 24rpx;
        
    }
    
    // 
    .person-video-list {
        // #ifdef H5
        height: 100%;
        // #endif
        flex: 1;
        flex-direction: row;
        flex-wrap: wrap;
        width: 750rpx;
        padding: 20rpx 0;
    }
    .person-video {
        // #ifdef H5
        display: inline-block;
        // #endif
        position: relative;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: 250rpx;
        height: 330rpx;
    }
    .person-video-box {
        height: 310rpx;
        width: 230rpx;
    }
    .person-video-bot {
        position: absolute;
        bottom: 10rpx;
        left: 10rpx;
        width: 230rpx;
        flex-direction: row;
        z-index: 9999
    }
    .person-video-img {
        width: 230rpx;
        height: 310rpx;
    }
    .person-video-text {
        color: #fff;
        font-size: 30rpx;
    }
    .person-list-container {
        flex-direction: column;
    }
    .person-list-wrap {
        height: 260px;
    }
    .person-footer {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 98rpx;
        padding: 16rpx 0;
        background-color: #f0f0f0;
        flex-direction: row;
    }
    .person-footer-item {
        flex-direction: row;
        align-items: center;
        justify-content: center;
        flex: 1;
        height: 66rpx;
        line-height: 66rpx;
        text-align: center;
        border-right-color: #cccccc;
        border-right-width: 1rpx;
        border-style: solid;
    }
    .person-footer-item-text {
        font-size: 32rpx;
    }
    .person-footer-item-follow-text {
        color: $uni-color-primary;
    }
    
    
    // 观众列表样式
    .top-list {
        height: 800rpx;
        background-color: #fff;
        border-radius: 20rpx;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
    }
    .top-list-head {
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
    }
    .top-list-info {
            margin-left: 20rpx;
            flex: 1;
        }
    .top-list-left {
        flex-direction: row;
        flex: 1;
    }
    .top-list-item {
        flex-direction: row;
        padding: 0 24rpx;
        margin: 40rpx 0;
    }
    .top-list-person-avatar-icon {
        margin-left: 20rpx;
    }
    .top-list-text {
        margin-top: 18rpx;
        color: #999999;
        font-size: 20rpx;
    }
    .top-list-name-wrap {
        flex-direction: row;
        align-items: center;
    }
    .top-list-tag {
        width: 120rpx;
        line-height: 50rpx;
        text-align: center;
        font-size: 24rpx;
        border-radius: 30rpx;
        background-color: $uni-color-primary;
        text-align: center;
        color: #fff;
    }
    .top-list-tag-followed {
        background-color: #dcdcdc;
    }
    
    .chat-view-wrap {
        width: 600rpx;
        height: 1000rpx;
        border-radius: 20rpx;
        background-color: #F3F3F3;
    }
    .chat-header {
        height: 80rpx;
        line-height: 80rpx;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        background-color: $uni-color-primary;
    }
    .chat-header-text {
        color: #fff;
        font-size: 28rpx;
    }
    .message-wrapper {
        height: 800rpx;
        background-color: #fff;
    }
</style>
