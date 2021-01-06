<template>
    <div>
      <!-- 精选路线 -->
      <div class="selected-travel" v-if="selectedTraList && selectedTraList.length > 0">
        <p class="title">- 精选路线 -</p>
        <div class="select-item" v-for="(item, index) in selectedTraList" :key = index @click="goTravelDetail(item)">
          <div class="po-re">
            <img :src="item.imgUrl" alt="">
            <p class="left">
              <span v-if="item.departure">{{item.departure}}出发</span>
              <span v-if="item.typeName">{{item.typeName}}</span>
            </p>
            <p class="right">
              <span>￥</span>
              <span class="price">{{item.price}}</span>
              <span>起</span>
            </p>
          </div>
          <p class="title">{{item.productName}}</p>
          <p class="sec-title">{{item.recommend}}</p>
        </div>
        <!-- <div class="select-item">
          <div class="po-re">
            <img :src="themeImg" alt="">
            <p class="left">
              <span>深圳出发</span>
              <span>跟团游</span>
            </p>
            <p class="right">
              <span>￥</span>
              <span class="price">1299</span>
              <span>起</span>
            </p>
          </div>
          <p class="title">产品标题产品标题产品标题产品标题产品标题产品标题产品标题产品标题产品标题产品标题产品标题产品标题</p>
          <p class="sec-title">产品经理推荐产品经理推荐产品经理推荐产品经理推荐产品经理推荐产品经理推荐产品经理推荐</p>
        </div> -->
      </div>
    </div>
</template>
<script>
export default {
  props: [
    'parentId'
  ],
  data () {
    return {
      selectedTraList: [], // 精选路线列表
      themeImg: require('../../static/travelShop/images/common/themeBg.jpg')
    }
  },
  created () {
    this.getSelectedTraList()
  },
  methods: {
    // 获取列表
    getSelectedTraList () {
      this.$http.post(this.API.getProList, {
        data: {
          recommendType: 2, // 1-推荐 2-精选路线 3-超值特惠
          appMenuId: this.parentId
        }
      }).then(res => {
        if (res.code === 0) {
          console.log('精选路线')
          console.log(res)
          this.selectedTraList = res.result.data
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    // 跳转旅游产品详情页
    goTravelDetail (item) {
      let url = `/pages/travel/travelDetail/travelDetail?parentId=${item.id}`
      wx.navigateTo({
        url: url
      })
    }
  }
}
</script>
<style lang="scss"  scoped>
.selected-travel {
  background: #fff;
  padding-top: 30rpx;
  margin-top: 20rpx;
  .title{
      text-align: center;
      font-size: 30rpx;
  }
  .select-item{
      margin: 0 30rpx;
      padding-bottom: 30rpx;
      border-bottom: 1rpx solid #dcdcdc;
      .po-re{
        position: relative;
        color: #fff;
        font-size: 22rpx;
        margin: 30rpx 0 20rpx 0;
        img{
          width: 100%;
          height: 388rpx;
          display: block;
          border-radius: 5rpx;
        }
        .left{
          position: absolute;
          top: 0;
          left: 0;
          span{
          height: 36rpx;
          text-align: center;
          display: inline-block;
          }
          span:nth-child(1){
          background: #f87350;
          min-width: 110rpx;
          border-radius: 5rpx 0 0 0;
          }
          span:nth-child(2){
          background: rgba(0,0,0,0.5);
          min-width: 85rpx;
          border-radius: 0 0 5rpx 0;
          }
        }
        .right{
          position: absolute;
          bottom: 20rpx;
          right: 0;
          width: 128rpx;
          height: 50rpx;
          background: #ff9913;
          font-size: 20rpx;
          text-align: center;
          .price{
          font-size: 30rpx;
          }
        }
    }
    .title{
      font-size: 28rpx;
      text-align: left;
      color: #353535;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
    .sec-title{
      font-size: 24rpx;
      text-align: left;
      color: #888;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
  }
  .select-item:last-child{
    border-bottom: none;
  }
}
</style>

