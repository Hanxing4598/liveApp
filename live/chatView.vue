<template>
    <view class="content" v-if="showPage">
        <view class="loading-wrap">
            <uni-icons class="loading-icon rotate" type="spinner-cycle" size="24" color="#999" v-if="isUpper" ></uni-icons>
        </view>
        <scroll-view scroll-y class="box-1" :scroll-into-view="intoView"
                     :scroll-with-animation="true" @scrolltoupper="scrollUpper">
            <view class="talk-list">
                <view v-for="(item,index) in talkList" :key="index" :id="item.id">
                    <view class="talk-list-item flex_col" :class=" item.type == 1 ? 'talk-list-push':'talk-list-pull' ">
                        <image :src="item.pic" mode="aspectFill" class="talk-list-item-pic"></image>
                        <view :class="'talk-list-'+(item.type == 1 ? 'push':'pull')+'-content-wrap'"><text :class="['talk-list-item-content', 'talk-list-'+ (item.type == 1 ? 'push':'pull') +'-content']">{{item.content}}<text :class="['talk-list-'+(item.type == 1 ? 'push':'pull')+'-after']"></text></text></view>
                        <uni-icons class="loading-icon rotate" type="spinner-cycle" size="16" color="#999" v-if="item.showLoading"></uni-icons>
                        <uni-icons class="loading-icon" type="info-filled" size="16" color="red" v-if="item.showError"></uni-icons>
                    </view>
                </view>
            </view>
        </scroll-view>
        <view class="box-2" id="box-2">
            <view class="box-2-flex_col">
                <view class="box-2-flex_grow">
                    <input type="text" class="input-content" v-model="content" placeholder="请输入聊天内容" placeholder-style="color:#DDD;"
                           :cursor-spacing="6">
                </view>
                <text class="send" @tap="send">发送</text>
            </view>
        </view>
    </view>
</template>

<script>
  import store from '../../store'
	import $http from '@/common/request/request'
  export default {
    data() {
      return {
        talkList: [],
        userHeadImage: uni.getStorageSync('userInfo').avatar,
        content: '',
        inputHeight: 0,
        intoView: '',
        chatId: '',
        chatTarget: {},
        isUpper: false,
        showPage: false,
        curPage: 1
      }
    },
    created() {
      this.loaded = false
      this.chatTarget = uni.getStorageSync('chatTarget')
      this.chatId = this.chatTarget.id
      uni.setNavigationBarTitle({
        title: this.chatTarget.nickName
      })
      let urlStr = store.state.chatUrl.replace(/(http|https):\/\//g, '')
      let newStr = 'ws://'+ urlStr +'imserver/' + uni.getStorageSync('userInfo').id
      this.contactSocket(newStr)
    },
    mounted() {
      this.getTalkList(() => {
        setTimeout(() => {
          if (this.talkList.length > 0) {
            this.intoView = this.talkList[this.talkList.length - 1].id
          }
        }, 100)
        this.showPage = true
      })
    },
    destroyed() {
      uni.closeSocket()
    },
    methods: {
      scrollUpper() {
        if (this.loaded || this.talkList.length == 0) {
          return
        }
        this.isUpper = true
        this.curPage++
        this.getTalkList((res) => {
          if (res.length <= 0) {
            this.loaded = true
            return
          }
        }, false, 1)
      },
      // type = 1 顶部加载更多
      getTalkList(fn = () => {}, showLoading = true, type = 0) {
        $http.post('/customerMsgBox/ajaxPage', {
          data: {
            currentPage: this.curPage,
            pageSize: 20,
            msgType: 3,
            senderId: this.chatId
          },
          showLoading
        }).then(res => {
          this.isUpper = false
          if (res.code === 0) {
              console.log('talkList--------------', this.talkList);
            let data = []
            let id = uni.getStorageSync('userInfo').id
            res.result.data = res.result.data.reverse()
            res.result.data.forEach((item, index) => {
              data.push({
                "id": 'id' + new Date().getTime() + index,
                "content": item.msgContent,
                "type": id == item.senderId ? 1 : 0,
                "showLoading": false,
                showError: false,
                pic: id == item.senderId ? uni.getStorageSync('userInfo').avatar : this.chatTarget.photo
              })
            })
            let talkData = data;
            if (type === 1) {
              talkData = talkData.reverse()
            }
            talkData.forEach(item => {
              if (type === 1) {
                this.talkList.unshift(item)
              } else {
                this.talkList.push(item)
              }
            })
            fn(res.result.data)
          }
        })
      },
      contactSocket(newStr) {
        uni.connectSocket({
          url: newStr,
          data() {
            return {
              msg: 'Hello'
            }
          },
          success(res) {
            // 这里是接口调用成功的回调，不是连接成功的回调，请注意
          },
          fail(err) {
            // 这里是接口调用失败的回调，不是连接失败的回调，请注意
          }
        })

        uni.onSocketOpen((res) => {

        })

        uni.onSocketMessage((res) => {
          let data = res.data
          if (data.charAt(0) === '{') {
            data = JSON.parse(data)
          }
          if (data.sendOneMsg) {
            this.talkList.push({
              "id": 'id' + new Date().getTime(),
              "content": data.sendOneMsg.msg,
              "type": 0,
              "showLoading": false,
              showError: false,
              pic: this.chatTarget.photo
            })

            setTimeout(() => {
              if (this.talkList.length > 0) {
                this.intoView = this.talkList[this.talkList.length - 1].id
              }
            }, 100)
          }
        })

        uni.onSocketError((err) => {
          this.alert.showToast({
            title: '连接失败！',
            icon: 'none'
          })
        })

        uni.onSocketClose((res) => {
          console.log('onClose', res)
        })
      },
      // 发送信息
      send() {
        if (!this.content) {
          uni.showToast({
            title: '请输入有效的内容',
            icon: 'none'
          })
          return;
        }
        const self = this
        self.talkList.push({
          "id": 'id' + new Date().getTime(),
          "content": self.content,
          "type": 1,
          "showLoading": true,
          showError: false,
          pic: uni.getStorageSync('userInfo').avatar
        });
        self.$nextTick(() => {
          self.content = '';
        })

        console.log({
            receiverId: self.chatTarget.id,
            msgContent: self.content
          })
        $http.post('/customerMsgBox/sendMsg', {
          data: {
            receiverId: self.chatTarget.id,
            msgContent: self.content
          }
        }).then(res => {
          this.talkList[this.talkList.length - 1].showLoading = false
          if (res.code === 0) {
            setTimeout(() => {
              this.intoView = this.talkList[this.talkList.length - 1].id
            }, 100)
            /* self.talkList.push({
                "id": 'id' + new Date().getTime(),
                "content": res.result,
                "type": 0,
                pic: self.chatTarget.photo
            }); */
          } else {
            uni.showToast({
              title: res.message,
              icon: 'none'
            })
            this.talkList[this.talkList.length - 1].showError = true
          }
        })
        setTimeout(() => {
          self.intoView = self.talkList[self.talkList.length - 1].id
        }, 100)
      }
    }
  }
</script>

<style lang="scss" scoped>
    .flex_col {
        // #ifndef APP-NVUE
        display: flex;
        // #endif
        flex-direction: row;
    }

    .content {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        // height: 100%;
        background-color: #f3f3f3;
    }
    // #ifndef APP-NVUE
    page {
        background-color: #F3F3F3;
        height: 100%;
        font-size: 28rpx;
    }
    // #endif

    .box-1 {
        position: absolute;
        top: 0;
        bottom: 104rpx;
        left: 0;
        right: 0;
    }

    .box-2 {
        flex-direction: row;
        background-color: #F3F3F3;
        padding-bottom: 20rpx;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
    }

    .box-2-flex_col {
        flex: 1;
        flex-direction: row;
        // #ifndef APP-NVUE
        display: flex;
        // #endif
        padding: 20rpx;
    }

    .box-2-flex_grow {
        flex: 1;
    }

    .input-content {
        background-color: #fff;
        height: 64rpx;
        padding: 0 20rpx;
        border-radius: 32rpx;
        font-size: 28rpx;
    }
    .send {
        text-align: center;
        background-color: $uni-theme-color;
        color: #fff;
        height: 64rpx;
        margin-left: 20rpx;
        border-radius: 32rpx;
        padding: 0;
        width: 120rpx;
        line-height: 62rpx;
        font-size: 28rpx;

        &:active {
            background-color: $uni-theme-color;
        }
    }

    .talk-list-item {
        flex-direction: row;
        padding: 20rpx 20rpx 0 20rpx;
        align-items: flex-start;
        color: #333;
    }
    .talk-list-item-pic {
        width: 92rpx;
        height: 92rpx;
        border-radius: 50%;
        border-width: 1px;
        border-style: solid;
        border-color: #fff;
    }
    .talk-list-pull-content-wrap {
        // #ifndef APP-NVUE
        display: flex;
        // #endif
        flex-direction: row;
    }
    .talk-list-push-content-wrap {
        // #ifndef APP-NVUE
        display: flex;
        // #endif
        flex-direction: row-reverse;
        width: 500rpx;
    }
    .talk-list-pull-content-wrap {
        width: 500rpx;
    }
    .talk-list-item-content {
        padding: 20rpx;
        border-radius: 4px;
        // max-width: 500rpx;
        // word-break: break-all;
        line-height: 52rpx;
        position: relative;
        background-color: #fff;
        word-wrap: anywhere;
    }
    .talk-list-pull-content {
        margin-left: 32rpx;
        background-color: #fff;
    }
    .talk-list-pull-after {
        width: 0;
        height: 0;
        border-top-width: 16rpx;
        border-right-width: 20rpx;
        border-bottom-width: 16rpx;
        border-left-width: 0;
        border-style: solid;
        border-top-color: #F3F3F3;
        border-right-color: #fff;
        border-bottom-color: #F3F3F3;
        border-left-color: #fff;
        position: absolute;
        top: 30rpx;
        left: -18rpx;
    }
    .talk-list-push {
        /* 主轴为水平方向，起点在右端。使不修改DOM结构，也能改变元素排列顺序 */
        flex-direction: row-reverse;
    }
    .talk-list-push-content {
        margin-right: 32rpx;
        background-color: #a0e959;
    }
    .talk-list-push-after {
        width: 0;
        height: 0;
        border-top-width: 16rpx;
        border-right-width: 0;
        border-bottom-width: 16rpx;
        border-left-width: 20rpx;
        border-style: solid;
        border-top-color: #F3F3F3;
        border-right-color: #a0e959;
        border-bottom-color: #F3F3F3;
        border-left-color: #a0e959;
        position: absolute;
        top: 30rpx;
        right: -18rpx;
    }
    .talk-list {
        padding-bottom: 20rpx;
    }
    .loading-icon {
        margin-right: 20rpx;
        margin-top: 30rpx;
        transition-property: transform;
        transition-duration: 0.5s;
    }
    .rotate{
        transition-property: transform;
        transition-duration: 0.5s;
        // animation: rotate 3s linear infinite;
    }
    @keyframes rotate{from{transform: rotate(0deg)}
        to{transform: rotate(359deg)}
    }
    .loading-wrap {
        padding: 20rpx 0;
        text-align: center;
    }
</style>
