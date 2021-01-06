<template>
    <div>
      <div class="select-main">
        <ul class="tab">
          <li @click="openSelect('type')"   :class="{'active': mode === 'type'}" >类型<i class="icon2 bot-icon"></i></li>
          <li @click="openSelect('date')"  :class="{'active': mode === 'date'}">出发日期<i class="icon2 bot-icon"></i></li>
          <li @click="openSelect('space')"   :class="{'active': mode === 'space'}">目的地<i class="icon2 bot-icon"></i></li>
        </ul>
      </div>
      <div class="dialog-mask" v-if="isShowSelect" @click="closeMask" :style="'top:' + maskTop + 'rpx'"></div>
      <div class="select" v-if="isShowSelect">
        <!-- <div class="select-frame sort"  v-if="mode === 'guide'">
          <ul class="sort-list" >
            <li>达人陪游</li>
          </ul>
        </div> -->
        <div class="select-frame" v-if="mode === 'date'">
          <div class="select-item">
            <p class="title">出行时间</p>
            <div class="price-sel">
              <div>
                <picker mode="date"
                        :value="selData.startTime"
                        end="2217-09-01" @change="bindDateChangeStart($event)" style="position:reletive">
                  <span>{{selData.startTime || '开始日期'}}</span>
                </picker>
              </div>
              <i>——</i>
              <div>
                <picker mode="date"
                        :value="selData.endTime"
                        end="2217-09-01" @change="bindDateChangeEnd($event)">
                  <span>{{selData.endTime || '结束日期'}}</span>
                </picker>
              </div>
            </div>
          </div>
        </div>
        <div class="select-frame" v-if="mode === 'type'">
          <div class="select-item">
            <div class="dis-flex">
              <div :class="{'active': index == selIndex.typeIndex}"
                   v-for="(item, index) in sortRange" :key="index"
                   @click="getAllSelect(item.id , index, 'type', 'typeIndex')">
                {{item.typeName}}
              </div>
            </div>
          </div>
        </div>
        <div class="select-frame" v-if="mode === 'space'">
          <div class="select-item">
            <div class="dis-flex">
              <div :class="{'active': index == selIndex.hotDestinationIndex}"
                   v-for="(item, index) in hotDestinationList" :key="index"
                   @click="getAllSelect(item , index, 'destination', 'hotDestinationIndex')">
                {{item}}
              </div>
              <input class="input" type="text" placeholder="输入目的地" v-model="selData.destination" @focus="destinationFocus">
            </div>
          </div>
        </div>
        <div class="btn-box">
          <span @click="reset">重置</span>
          <span @click="confirm">确认</span>
        </div>
      </div>
      <div class="travels-box" @click="goPartnerDetail(item)" v-for="item in dataList">
        <div class="title">
          <img :src="item.urlPrefix + item.photo" alt="" class="header-img">
          <div class="name-box">
            <p class="name">{{item.nickName}}</p>
          </div>
        </div>
        <div class="right'"><span :class="'follow-btn ' + (item.isFollow === 0 ? '' : 'gray')" @click.stop="followEvt(item)">{{item.isFollow === 0 ? '关注+':'已关注'}}</span></div>
        <div class="main-box">
          <img :src="themeImg" alt="" class="bg-img">
          <div class="main-info">
            <p class="title">{{item.title}}</p>
            <p class="main">{{item.content}}</p>
            <p class="date">{{item.startTime}} <span>{{item.destination}}</span></p>
            <p class="time"> {{item.day}}</p>
            <p class="travels-btn" v-if="typeJson[item.typeId]">{{typeJson[item.typeId].typeName}}</p>
          </div>
        </div>
        <div class="msg-info">
          <span class="msg" ><i class="icon msg-icon"></i>{{item.commentNum}}</span>
          <span class="follow" @click.stop="likeEvt(item)"><i :class="'icon follow-icon ' + (item.isLike === 1 ? 'active':'')"></i>{{item.likeNum}}</span>
          <div class="img-modules">
            <div class="img-box">
              <img :src="img.photo" alt="" v-for="(img, iIndex) in item.applyPhotoList.slice(0, 10)" :key="iIndex">
            </div>
            <span class="dots" v-if="item.applyPhotoList.length > 10">...</span>
            <span class="num">{{item.applyPhotoList.length}}人已报名</span>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
  export default {
    data () {
      return {
        page: 1,
        currentCount: 1,
        mode: '',
        maskTop: 0,
        isShowSelect: false, // 是否展示筛选框
        sortRange: [],
        hotDestinationList: [], // 热门目的地
        typeJson: {}, // 类型对象
        selIndex: { // 筛选下标
          typeIndex: -1,
          hotDestinationIndex: -1
        },
        selData: { // 接口入参
          type: '', // 排序方式
          startTime: '', // 最早出发日期输入框
          endTime: '',
          destination: ''
        },
        dataList: [],
        themeImg: require('../../.../../../static/travelShop/images/common/themeBg.jpg'),
        miniIcon2: require('../../../static/travelShop/images/common/miniIcon2.jpg')
      }
    },
    created () {
      console.log(11)
      this.getTypeList()
      this.getHotDestination()
      this.page = 1
      this.dataList = []
      this.getList()
    },
    onReachBottom () {
      if (this.page >= this.currentCount) {
        console.log('数据加载完了')
      } else {
        this.getList()
      }
    },
    methods: {
      getTypeList() {
        this.$http.post(this.API.partnerTypeList, {
          data: {}
        }).then(res => {
          if (res.code === 0) {
            this.sortRange = res.result.data
            res.result.data.forEach(item => {
              this.typeJson[item.id] = item
            })
          }
        })
      },
      getList() {
        this.$http.post(this.API.partnerList, {
          data: {
            currentPage: this.page,
            pageSize: 10,
            type: 1,
            typeId: this.selData.type,
            startTime: this.selData.startTime,
            endTime: this.selData.endTime,
            destination: this.selData.destination
          },
          showLoading: false
        }).then(res => {
          if (res.code === 0) {
            this.currentCount = res.result.currentCount
            if (res.result.data.length > 0) {
              this.dataList = this.dataList.concat(res.result.data)
              this.page++
            }
          } else {
            wx.showToast({
              title: res.message,
              icon: 'none'
            })
          }
        })
      },
      getHotDestination() {
        this.$http.post(this.API.hotDestination, {
          data: {},
          showLoading: false
        }).then(res => {
          if (res.code === 0) {
            this.hotDestinationList = res.result
          } else {
            wx.showToast({
              title: res.message,
              icon: 'none'
            })
          }
        })
      },
      bindDateChangeStart (res) {
        this.selData.startTime = res.mp.detail.value
        this.compareDay(this.selData.startTime, this.selData.endTime)
      },
      bindDateChangeEnd (res) {
        this.selData.endTime = res.mp.detail.value
        this.compareDay(this.selData.startTime, this.selData.endTime)
      },
      // 比较日期大小
      compareDay(date1, date2) {
        var oDate1 = new Date(date1)
        var oDate2 = new Date(date2)
        if (oDate1.getTime() > oDate2.getTime()) {
          wx.showToast({
            title: '开始日期大于结束日期，请重新选择',
            icon: 'none'
          })
          let today = this.getToday()
          this.selData.startTime = today
          this.selData.endTime = today
        } else {
          console.log('第二个大')
        }
      },
      reset () {
        this.mode = ''
        this.selIndex.typeIndex = -1
        this.selData.startTime = ''
        this.selData.endTime = ''
        this.selData.type = ''
        this.isShowSelect = false
      },
      confirm () {
        this.mode = ''
        this.isShowSelect = false
        this.page = 1
        this.dataList = []
        this.getList()
      },
      closeMask () {
        this.isShowSelect = false
        this.mode = ''
      },
      // 切换每个筛选条件的下标和对应值
      getAllSelect (item, index, value, cIndex) {
        // value: 当前选中值(传给后端的值) cIndex：当前选中下标
        this.selData[value] = item
        this.selIndex[cIndex] = index
        console.log(this.selData)
      },
      openSelect (mode) {
        this.isShowSelect = true
        this.mode = mode
        // if (mode === 'sort') {
        //   this.maskTop = 535
        // }
        this.maskTop = 533
      },
      goPartnerDetail(item) {
        wx.navigateTo({
          url: `/pages/daren/partnerDetail/main?id=${item.id}&type=1`
        })
      },
      likeEvt(item) {
        let type = item.isLike === 0 ? 1 : 2
        this.$http.post(this.API.partnerLike, {
          data: {
            type: type,
            likeId: item.id
          }
        }).then(res => {
          if (res.code === 0) {
            let like = item.isLike === 0 ? 1 : 0
            item.isLike = like
            if (like === 1) {
              item.likeNum++
            } else {
              item.likeNum--
            }
            this.dataList.splice(0, 0)
          }
        })
      },
      followEvt (item) {
        let type = item.isFollow === 0 ? 1 : 2
        this.$http.post(this.API.partnerFollow, {
          data: {
            type: type,
            partnerId: item.id
          }
        }).then(res => {
          if (res.code === 0) {
            let text = ''
            let like = item.isFollow === 0 ? 1 : 0
            item.isFollow = like
            if (like === 1) {
              text = '关注成功'
            } else {
              text = '取消成功'
            }
            wx.showToast({title: text})
            this.dataList.splice(0, 0)
          } else {
            wx.showToast({title: res.message, icon: 'none'})
          }
        })
      },
      destinationFocus() {
        this.selData.destination = ''
        this.selIndex.hotDestinationIndex = -1
      }
    }
  }
</script>
<style lang="scss" scoped>
.select-main{
  padding: 0 30rpx 0 30rpx;
  background: #fff;
  font-size: 28rpx;
  position: relative;
  .icon2{
    background: url('../../../static/travelShop/images/travelSort.png');
    background-size: 200rpx 200rpx;
    background-position: -57rpx -10rpx;
    width: 20rpx;
    height: 12rpx;
    display: inline-block;
    vertical-align: middle;
  }
  .tab{
    display: flex;
    height: 89rpx;
    line-height: 89rpx;
    justify-content: space-between;
    .bot-icon{
      background-position: -146rpx -6rpx;
      margin-left: 10rpx;
    }
    .select-icon {
      background-position: -166rpx -5rpx;
      margin-left: 10rpx;
      width: 22rpx;
      height: 25rpx;
    }
    li.active{
      color: #ff9913;
      .bot-icon{
        background-position: -146rpx -17rpx;
      }
      .select-icon {
        background-position: -38rpx -35rpx;
      }
    }
  }
}
.travels-box{
  background: #fff;
  padding: 30rpx;
  margin-top: 20rpx;
  position: relative;
  .title{
    color: #333333;
    font-size: 30rpx;
    .header-img{
      width: 90rpx;
      height: 90rpx;
      border-radius:50%;
      display: inline-block;
      vertical-align: middle;
    }
    .name-box{
      display: inline-block;
      margin-left: 24rpx;
      font-size: 32rpx;
      vertical-align: middle;
    }
  }
  .right{
    position: absolute;
    right: 30rpx;
    top: 50rpx;
    color: #388ef8;
    font-size: 30rpx;
  }
  .follow-icon, .msg-icon, .see-icon{
    width: 25rpx;
    height: 20rpx;
    background-position: 0 -62rpx;
    margin-right: 8rpx;
  }
  .follow-icon{
    background-position: -23rpx -63rpx;
    &.active {
      width: 25rpx;
      height: 25rpx;
      background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACnklEQVRYR+2WS2gTURSG/5O5U1QKIpYiIlgUxZhJiwS66cpFlyrSzlR8lG4URHAjuBFfGBeCuBIX6kZEQietC8WdYJGqSH1AM6kIPuhCECpFkJLWeRyZQGPTPO7c2cSF2QX+77t/DvfeXEKLP9Ti9fG/wL87Ac82jgHoZ6CHgG4GpolRYOCT6OzI0t4Jb+X+4fHuLZ4fnAYjRcS7CdQRMmDMIMGvhVm8W2+/1UyAn3Wt8efabwA42WSDvgJwVVjOkzDj5dMmcZBl0M6GDGFCa3P304GPv1ZmqgqUHqS36Tp/jnoymHE5zBLhYlRGg95J1vu55XxVAdc2ZghIRpXFzD0VltNfU8C1jXMEZGNKlTAiPqWZxVvl6S2Tvp1+x+A9SqaY4XBz6pbTUynAjzPr/NLSQkxfLOzHYqJ90/D0QnkCv+10JgF+E8sUEwoC7m07VJwqFyjldnXpmvga0xUL0xK0nQYLXyp7wBs15kHYEMumDv0UllNeq1LAtY1JAvrUXeoEAy91yymv9XcCdmoQoLy6Lg7BprCKY1UFwi9ePn0bzMfjKCMzRHeEWThR9yYsjSe36n5iAqCuyEK14FtX8wfWDnyYrVtgxaX0jcGb1dzS9LywnI2rUw3fA55tPAKwT6qNEGDGlD7k9NaLNn2QuKPGJZV/urpdiHLCLBxu1FP6IvJs4yCAhxF+aE2EiK5oZuFCM1ZaIITd0VQfEU0qlWAeEUPFezImUoFQwmPJHX6g5QBkJNJZTeMjNFB8IVu85h6QAWxn1vu8dBOEow2yzxcRDLVbM99lrqbHUAb7eeM6M86syt0XljMsYyMfQ5nIz6fOMtO18hiJsppZOC9jlI+hTOjZ6RFQIBo9uWW88h6IIlTNRD4FquKo+ZYX+AP1jMghngiQ8wAAAABJRU5ErkJggg==") no-repeat;
      background-size: 100%;
    }
  }
  .msg-icon{
    background-position: -51rpx -63rpx;
  }
  .follow-btn{
    border: 1rpx solid #ff9913;
    border-radius: 30rpx;
    color: #ff9913;
    width: 100rpx;
    height: 40rpx;
    display: inline-block;
    text-align: center;
    line-height: 40rpx;
    font-size: 24rpx;
    margin-top: 20rpx;
    &.gray {
      border-color: #999;
      color: #999;
    }
  }
  .main-box{
    margin-top: 20rpx;
    position: relative;
    .bg-img{
      width: 690rpx;
      height: 300rpx;
      display: block;
    }
    .main-info{
      color: #ffffff;
      font-size: 24rpx;
      position: absolute;
      top: 0;
      width: 690rpx;
      height: 300rpx;
      background: rgba(0,0,0,0.2);
      .title{
        overflow: hidden;
        text-overflow: ellipsis; //超出部分以省略号显示
        white-space: nowrap;
        width: 543rpx;
        text-align: center;
        margin: 0 auto;
        margin-top:10rpx;
        color: #ffffff;
        font-size: 32rpx;
        // text-shadow:5px 1px 6px #000
      }
      .main{
        width: 622rpx;
        margin: 0 auto;
        // margin-top:10rpx;
        overflow : hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2; /* 可以显示的行数，超出部分用...表示*/
        -webkit-box-orient: vertical;
      }
      .date{
        width: 520rpx;
        margin: 0 auto;
        margin-top:10rpx;
        span{
          float: right;
        }
      }
      .time{
        text-align: center;
        margin-top:10rpx;
        font-size: 30rpx;
      }
      .travels-btn{
        width: 190rpx;
        height: 40rpx;
        background-color: #fbb03b;
        border-radius: 20rpx;
        font-size: 24rpx;
        line-height: 40rpx;
        color: #ffffff;
        text-align:center;
        margin: 0 auto;
        margin-top: 10rpx;
      }
    }
  }
  .msg-info{
    font-size: 22rpx;
    color: #666;
    margin-top: 15rpx;
    .img-modules{
      float: right;
      margin-top: -5rpx;
      .img-box{
        display: inline-block;
        max-width: 250rpx;
        vertical-align: middle;
        margin-left: 100rpx;
        img{
          width: 40rpx;
          height: 40rpx;
          display: inline-block;
          margin-left: -7rpx;
          border-radius: 50%
        }
      }
      .dots{
        color: #666666;
        font-size: 30rpx;
        margin:0 10rpx;
        line-height: 35rpx;
        vertical-align: top;
      }
      .num{
        color: #666666;
        font-size: 20rpx;
        vertical-align: middle;
      }
    }
  }
  .msg{
    margin-left: 60rpx;
  }
}
.icon{
  background: url('../../../static/travelShop/images/travelPerson.png');
  background-size: 200rpx 100rpx;
  width: 50rpx;
  height: 50rpx;
  display: inline-block;
  vertical-align: middle;
}
.select{
  position: absolute;
  display: inline-block;
  z-index: 999;
  animation: mymove .3s forwards;
  padding: 0 30rpx;
  left: 0rpx;
  background: #fff;
  .select-frame{
    position: relative;
    overflow-y: auto;
    background: #fff;
    z-index: 10;
    width: 690rpx;
    height: 250rpx;
    font-size: 24rpx;
    color: #353535;
    .select-item{
      border-bottom: 1rpx solid #dcdcdc;
      margin-top: 15rpx;
      .title{
        margin-bottom: 7rpx;
      }
      .dis-flex{
        display: flex;
        flex-wrap: wrap;
        padding-bottom: 24rpx;
        .input {
          width: 200rpx;
          margin: 20rpx;
          line-height: 60rpx;
          height: 60rpx;
          text-align: center;
          border-radius: 10rpx;
          background-color: #ddd;
        }
        div{
          height: 60rpx;
          line-height: 60rpx;
          width: 23%;
          background: #f4f4f4;
          text-align: center;
          border-radius: 5rpx;
          margin-top: 15rpx;
          margin-right: 2%;
        }
        div:nth-child(4){
          margin-right: 0;
        }
        div.active{
          background: #ff9913;
          color: #fff;
        }
      }
    }
    .price-sel{
      display: flex;
      margin-top: 24rpx;

      width: 100%;
      span{
        width: 302rpx;
        height: 58rpx;
        line-height: 58rpx;
        color: #353535;
        text-align: center;
        border: 1rpx solid #dcdcdc;
        display: inline-block;
        border-radius: 8rpx;
      }
      i{
        vertical-align: top;
        display: inline-block;
        color: #dcdcdc;
        margin: 10rpx 10rpx;
      }
    }
    .select-item:last-child{
      border-bottom: none;
    }
    .sort-list{
      li {
        height: 66rpx;
        line-height: 66rpx;
        color: #353535;
        font-size: 28rpx;
        border-bottom: 1rpx solid #dcdcdc;
        text-align: center;
      }
      li.active{
        color: #ff9913;
      }
      li:last-child{
        border-bottom:none;
      }
    }
  }
  .select-frame.sort{
    height: 330rpx;
  }
  .btn-box{
    span{
      display: inline-block;
      border-top: 1rpx solid #dcdcdc;
      width: 50%;
      text-align: center;
      height: 80rpx;
      line-height: 80rpx;
      background: #fff;
    }
    span:nth-child(2){
      background: #ff9913;
      color: #fff;
    }
  }
}
@keyframes mymove
{
  from {opacity: 0 }
  to {opacity:1;}
}
@-webkit-keyframes mymove
{
  from {opacity: 0 }
  to {opacity:1;}
}
.dialog-mask{
  position: absolute;
  top: 0%;
  left: 0%;
  width: 100%;
  height: 100vh;
  background: rgba(0,0,0,0.5);
  z-index: 99999;
  animation: mymove .3s forwards;
}
</style>
