<template>
    <view class="wrapper">
		<view class="list">
            <view class="list-item" v-for="(item, index) in list" @click="toChat(item)" :key="index">
                <image class="avatar" :src="item.photo" mode="aspectFill"></image>
                <view class="content">
                    <view class="left">
                        <text class="name over-1">{{item.nickName}}</text>
                        <text class="text over-1">{{item.msgContent}}</text>
                    </view>
                    <view class="right">
                        <text class="time">{{timestampFormat(item.createTime)}}</text>
                        <text class="count" v-if="item.msgNum > 0">{{item.msgNum}}</text>
                    </view>
                </view>
            </view>
        </view>
		<uni-empty v-if="list.length === 0"></uni-empty>
	</view>
</template>

<script>
    import $http from '@/common/request/request'
	export default {
		data() {
			return {
				list: [],
				current: 1,
				arr: [],
				myId:'',
				loaded: false,
				showLoading: true
			};
		},
		destroyed() {
			// this.request_hide_loading()
		},
        created() {
            this.initList()
        },
		methods: {
            bottom() {
                if (this.loaded) {
                	return
                }
                this.current++
                uni.showLoading({
                	title: '加载中...',
                	mask: true
                });
                this.getLists(res => {
                	uni.hideLoading()
                	if (res.length === 0) {
                		this.alert.showToast({
                			title: '没有了'
                		})
                		this.loaded = true
                		return
                	}
                })
            },
            pull() {
                this.current = 1
                this.list = []
                this.getLists()
                setTimeout(() => {
                  uni.stopPullDownRefresh()
                }, 1000)
            },
            initList() {
                this.current = 1
                this.list = []
                this.getLists()
            },
            toChat(item) {
                $http.post('/customerMsgBox/read', {
                	data: {
                        senderId: item.id
                	}
                }).then(res => {
                    if (res.code === 0) {
                        this.$emit('read', item)
                    } else {
                        uni.showToast({
                            title: res.message
                        })
                    }
                })
            },
			getLists(callback = () => {}) {
				$http.post('/customerMsgBox/queryCustomerMsgPage', {
					data: {
                        currentPage: this.current,
                        pageSize: 10
					}
				}).then(res => {
                    res.result.data.forEach(item => {
                        item.createTime = item.createTime.replace('-', '/').replace('-', '/')
                    })
                    console.log(res.result.data)
                    this.list = [...this.list, ...res.result.data]
					callback(res)
				})
			},
            timestampFormat (timestamp) {
              timestamp = typeof timestamp === 'string' ? (new Date(timestamp).getTime() / 1000) : timestamp
              function zeroize(num) {
                return (String(num).length === 1 ? '0' : '') + num
              }
            
              var curTimestamp = parseInt(new Date().getTime() / 1000) // 当前时间戳
              var timestampDiff = curTimestamp - timestamp // 参数时间戳与当前时间戳相差秒数
            
              var curDate = new Date(curTimestamp * 1000) // 当前时间日期对象
              var tmDate = new Date(timestamp * 1000) // 参数时间戳转换成的日期对象
            
              // eslint-disable-next-line one-var
              let Y = tmDate.getFullYear(), m = tmDate.getMonth() + 1, d = tmDate.getDate()
              // eslint-disable-next-line one-var
              let H = tmDate.getHours(), i = tmDate.getMinutes()
            
              if (timestampDiff < 60) { // 一分钟以内
                return '刚刚'
              } else if (timestampDiff < 3600) { // 一小时前之内
                return Math.floor(timestampDiff / 60) + '分钟前'
              } else if (curDate.getFullYear() === Y && curDate.getMonth() + 1 === m && curDate.getDate() === d) {
                return '今天' + zeroize(H) + ':' + zeroize(i)
              } else {
                var newDate = new Date((curTimestamp - 86400) * 1000) // 参数中的时间戳加一天转换成的日期对象
                if (newDate.getFullYear() === Y && newDate.getMonth() + 1 === m && newDate.getDate() === d) {
                  return '昨天' + zeroize(H) + ':' + zeroize(i)
                } else if (curDate.getFullYear() === Y) {
                  return zeroize(m) + '-' + zeroize(d) + ' ' + zeroize(H) + ':' + zeroize(i)
                } else {
                  return Y + '-' + zeroize(m) + '-' + zeroize(d) + '- ' + zeroize(H) + ':' + zeroize(i)
                }
              }
            }
		}
	}
</script>

<style lang="scss" scoped>
    .avatar {
        width: 90rpx;
        height: 90rpx;
        border-radius: 50%;
        margin-right: 40rpx;
    }
    .content {
        // #ifndef APP-NVUE
        display: flex;
        // #endif
        flex-direction: row;
        justify-content: space-between;
        position: absolute;
        left: 114rpx;
        right: 24rpx;
        top: 24rpx;
        bottom: 0;
        margin-left: 40rpx;
        padding-top: 10rpx;
        // #ifndef APP-NVUE
        border-bottom: 1px solid $uni-border-color;
        // #endif
        
        
        // #ifdef APP-NVUE
        border-width: 0;
        border-bottom-width: 1px;
        border-style: solid;
        border-bottom-color: $uni-border-color;
        // #endif
        
    }
    .left {
        // #ifndef APP-NVUE
        display: flex;
        // #endif
        flex-direction: column;
            width: 70%;
        }
        .name {
            font-size: 32rpx;
        }
        .text {
            margin-top: 20rpx;
            color: #999999;
            font-size: 28rpx;
        }
        .right {
            flex-direction: column;
            align-items: flex-end;
            text-align: right;
        }
        .count {
            // #ifndef APP-NVUE
            display: inline-block;
            // #endif
            width: 32rpx;
            height: 32rpx;
            line-height: 32rpx;
            border-radius: 50%;
            background-color: #f43530;
            margin-top: 20rpx;
            text-align: center;
            font-size: 20rpx;
            color: #fff;
        }
    .list-item {
        position: relative;
        padding: 24rpx;
    }
    .over-1 {
        overflow: hidden;
        lines: 1;
        text-overflow: ellipsis;
    }
</style>
