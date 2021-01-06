<template>
  <div>
    <!-- 热门推荐 -->
    <div class="more-recom"  v-if="recommenList && recommenList.length > 0">
      <p class="title">- 热门推荐 -</p>
      <div class="goods-card">
        <div class="goods-card-item"  v-for="(item, index) in recommenList" :key = index  @click="goTravelDetail(item)">
          <div class="po-rel">
            <img :src="item.imgUrl" alt="">
            <span v-if="item.typeName">{{item.typeName}}</span>
          </div>
          <p class="goods-title">{{item.productName}}</p>
          <div>
            <span class="place">{{item.departure}}出发</span>
            <span class="right">
              <span class="symbol">￥</span>
              <span class="price">{{item.price}}</span>
              <span>起</span>
            </span>
          </div>
        </div>
        <!-- <div class="goods-card-item">
          <div class="po-rel">
            <img :src="themeImg" alt="">
            <span>跟团游</span>
          </div>
          <p class="goods-title">复仇者联盟复仇者联盟复仇者联盟复仇者联盟复仇者联盟复仇者联盟复仇者联盟复仇者联盟复仇者联盟</p>
          <div>
            <span class="place">深圳出发</span>
            <span class="right">
              <span class="symbol">￥</span>
              <span class="price">68.00</span>
              <span>起</span>
            </span>
          </div>
        </div> -->
      </div>
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
      recommenList: [], // 推荐列表
      themeImg: require('../../static/travelShop/images/common/themeBg.jpg')
    }
  },
  mounted () {
    this.getSelectedTraList()
  },
  methods: {
    getSelectedTraList () {
      this.$http.post(this.API.getProList, {
        data: {
          recommendType: 1, // 1-推荐 2-精选路线 3-超值特惠
          appMenuId: this.parentId
        }
      }).then(res => {
        if (res.code === 0) {
          console.log('推荐')
          console.log(res)
          this.recommenList = res.result.data
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
      let url = `/pages/travel/travelDetail/main?parentId=${item.id}`
      wx.navigateTo({
        url: url
      })
    }
  }
}
</script>>
<style lang="scss" scoped>
.more-recom{
  margin-top: 20rpx;
  padding: 30rpx;
  .title{
    text-align: center;
    font-size: 30rpx;
  }
  .goods-card{
    display: flex;
    flex-wrap: wrap;
    .goods-card-item:nth-child(2n){
      margin-right: 0;
    }
    .goods-card-item{
      background: #fff;
      margin: 20rpx 20rpx 0 0 ;
      width: 335rpx;
      font-size: 24rpx;
      padding-bottom: 20rpx;
      border-radius: 10rpx;
      .po-rel {
        position: relative;
        img{
          width: 100%;
          height: 250rpx;
          margin: 0 auto;
          border-radius: 10rpx 10rpx 0 0;
          display: block;
        }
        span{
          position: absolute;
          top:0;
          left:0;
          width: 84rpx;
          height: 34rpx;
          color: #fff;
          background: rgba(0,0,0,0.5);
          text-align: center;
          font-size: 20rpx;
          border-radius: 10rpx 0 0 0 ;
        }
      }
      .goods-title {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        margin:15rpx 0 10rpx 0;
        color: #353535;
        padding: 0 10rpx;
      }
      .right{
        float: right;
        margin-right:20rpx;
        font-size: 20rpx;
        color: #888;
        .symbol{
          font-size: 20rpx;
          color: #f65631;
        }
        .price{
          font-size:30rpx;
          color: #f65631;
        }
      }
      .place{
        color: #888;
        font-size: 20rpx;
        margin-top: 10rpx;
        margin-left: 10rpx;
      }
    }
  }
}
</style>
