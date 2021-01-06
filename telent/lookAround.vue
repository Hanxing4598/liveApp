<template>
    <div class="look-around-box" @click="goDetail(item)" v-for="(item, index) in list" :key="index">
            <div v-if="item.forwardCasualLook" >
              <!-- 转发 -->
              <div class="title">
                <image :src="item.photo ? (item.urlPrefix + item.photo) : userLogo" class="header-img" @click.stop="goPersonIndex(item)" mode="aspectFill"></image>
                <div class="name-box"  @click.stop="goPersonIndex(item)">
                  <p class="name">{{item.nickName}}</p>
                  <p class="data">{{item.createTimeStr}}</p>
                </div>
              </div>
              <div class="right"  v-if="customerId !== item.customerId"><span :class="'follow-btn ' + (item.isFollow === 0 ? '' : 'gray')" @click.stop="followEvt(item)">{{item.isFollow === 0 ? '关注+':'已关注'}}</span></div>
              <div class="main forwardContent-text">
                <wxParse :content="item.forwardContent" @navigate="navigate" />
              </div>
              <div class="look-around-box forwardCasualLook-wrap">
                <div class="img-box">
                  <!--<div class="img-pic-flex" v-if="item.forwardCasualLook.imgUrl.length <= 2">
                    <image mode="aspectFill" class="img" :src="item.urlPrefix + url" v-for="(url, uIndex) in  item.forwardCasualLook.imgUrl" :key="uIndex"></image>
                  </div>
                  <template v-else>
                    <image mode="aspectFill" :src="item.urlPrefix + item.forwardCasualLook.imgUrl[0]" class="img1" ></image>
                    <div class="right-img">
                      <image mode="aspectFill" :src="item.urlPrefix + item.forwardCasualLook.imgUrl[1]" class="img2"></image>
                      <image mode="aspectFill" :src="item.urlPrefix + item.forwardCasualLook.imgUrl[2]" class="img3"></image>
                    </div>
                  </template>-->
                  <div class="img-pic-flex">
                    <swiper @animationfinish="swiperChange($event, item)">
                      <swiper-item v-for="(url, uIndex) in  item.forwardCasualLook.imgUrl" :key="uIndex">
                        <image mode="aspectFill" class="img" :src="item.urlPrefix + url"></image>
                      </swiper-item>
                    </swiper>
                    <div class="indicator-wrap">{{item.curIndex}} / {{item.forwardCasualLook.imgUrl.length}}</div>
                  </div>
                </div>
                <div class="main">
                  <wxParse :content="item.forwardCasualLook.content" @navigate="navigate"/>
                </div>
                <div class="msg-info">
                  <span class="location"><i class="icon location-icon"></i>{{item.forwardCasualLook.address}}</span>
                  <span class="space">相距{{item.distance}}km</span>
                  <!-- <div class="fr" style="float: right">
                    <span class="msg" ><i class="icon msg-icon"></i>{{item.commentNum}}</span>
                    <span class="follow" @click.stop="likeEvt(item)"><i :class="'icon follow-icon ' + (item.isLike === 1 ? 'active':'')"></i>{{item.likeNum}}</span>
                  </div> -->
                </div>
                <div class="social-box">
                  <div class="social-item">
                    <i class="icon zf-icon"></i>
                    <span>{{item.forwardCasualLook.forwardNum}}</span>
                  </div>
                  <div class="social-item" >
                    <i class="icon pl-icon"></i>
                    <span>{{item.forwardCasualLook.commentNum}}</span>
                  </div>
                  <div class="social-item">
                    <i :class="'icon dz-icon ' + (item.isLike === 1 ? 'active':'')"></i>
                    <span>{{item.forwardCasualLook.likeNum}}</span>
                  </div>
                </div>
              </div>
              <div class="like">
                <div class="img-flex">
                  <img :src="img.photo ? (item.urlPrefix + img.photo) : userLogo" alt="" v-for="(img, iIndex) in item.photoList" v-if="iIndex <= 9" :key="iIndex" mode='aspectFill'>
                </div>
                <span class="omit" v-if="item.photoList.length > 10">...</span>
                <span class="like-txt">{{item.likeNum}}人喜欢</span>
              </div>
              <div class="social-box">
                <div class="social-item" @click.stop="goForward(item.forwardCasualLook)">
                  <i class="icon zf-icon"></i>
                 <!-- <span>{{item.forwardNum}}</span> -->
                </div>
                <div class="social-item" >
                  <i class="icon pl-icon"></i>
                  <span>{{item.commentNum}}</span>
                </div>
                <div class="social-item"  @click.stop="likeEvt(item)">
                  <i :class="'icon dz-icon ' + (item.isLike === 1 ? 'active':'')"></i>
                  <span>{{item.likeNum}}</span>
                </div>
              </div>
            </div>
            <div v-else >
              <div class="title">
                <img :src="item.photo ? (item.urlPrefix + item.photo) : userLogo" class="header-img" @click.stop="goPersonIndex(item)">
                <div class="name-box" @click.stop="goPersonIndex(item)">
                  <p class="name">{{item.nickName}}</p>
                  <p class="data">{{item.createTimeStr}}</p>
                </div>
              </div>
              <div class="right" v-if="customerId !== item.customerId"><span :class="'follow-btn ' + (item.isFollow === 0 ? '' : 'gray')" @click.stop="followEvt(item)">{{item.isFollow === 0 ? '关注+':'已关注'}}</span></div>
              <div class="img-box">
                <!--<div class="img-pic-flex" v-if="item.imgUrl.length <= 2">
                  <image mode="aspectFill" class="img" :src="item.urlPrefix + url" v-for="(url, uIndex) in  item.imgUrl" :key="uIndex"></image>
                </div>
                <template v-else>
                  <image mode="aspectFill" :src="item.urlPrefix + item.imgUrl[0]" class="img1" ></image>
                  <div class="right-img">
                    <image mode="aspectFill" :src="item.urlPrefix + item.imgUrl[1]" class="img2"></image>
                    <image mode="aspectFill" :src="item.urlPrefix + item.imgUrl[2]" class="img3"></image>
                  </div>
                </template>-->
                <div class="img-pic-flex">
                  <swiper @animationfinish="swiperChange($event, item)">
                    <swiper-item v-for="(url, uIndex) in  item.imgUrl" :key="uIndex">
                      <image mode="aspectFill" class="img" :src="item.urlPrefix + url"></image>
                    </swiper-item>
                  </swiper>
                  <div class="indicator-wrap">{{item.curIndex}} / {{item.imgUrl.length}}</div>
                </div>
              </div>
              <div class="main">
                <wxParse :content="item.content" @navigate="navigate"/>
              </div>
              <div class="msg-info">
                <span class="location"><i class="icon location-icon"></i>{{item.address}}</span>
                <span class="space">相距{{item.distance}}km</span>
                <!-- <div class="fr" style="float: right">
                  <span class="msg" ><i class="icon msg-icon"></i>{{item.commentNum}}</span>
                  <span class="follow" @click.stop="likeEvt(item)"><i :class="'icon follow-icon ' + (item.isLike === 1 ? 'active':'')"></i>{{item.likeNum}}</span>
                </div> -->
              </div>
              <div class="like">
                <div class="img-flex">
                  <img :src="img.photo ? (item.urlPrefix + img.photo) : userLogo" alt="" v-for="(img, iIndex) in item.photoList" v-if="iIndex <= 9" :key="iIndex" mode='aspectFill'>
                </div>
                <span class="omit" v-if="item.photoList.length > 10">...</span>
                <span class="like-txt">{{item.likeNum}}人喜欢</span>
              </div>
              <div class="social-box">
                <div class="social-item" @click.stop="goForward(item)">
                  <i class="icon zf-icon"></i>
                  <span>{{item.forwardNum}}</span>
                </div>
                <div class="social-item" >
                  <i class="icon pl-icon"></i>
                  <span>{{item.commentNum}}</span>
                </div>
                <div class="social-item"  @click.stop="likeEvt(item)">
                  <i :class="'icon dz-icon ' + (item.isLike === 1 ? 'active':'')"></i>
                  <span>{{item.likeNum}}</span>
                </div>
              </div>
            </div>
          </div>
</template>

<script>
    export default {
        props: {
            list: {
                type: Array,
                default() {
                    return []
                }
            }
        },
        data () {
          return {
          }
        },
        created () {
        },
        methods: {
        }
      }
</script>

<style lang="scss" scoped>
    .header-img{
      width: 90rpx;
      height: 90rpx;
      border-radius:50%;
      display: inline-block;
      vertical-align: middle;
    }
    .look-around-box{
      background: #fff;
      padding: 50rpx 30rpx 0 30rpx;
      margin-top: 20rpx;
      position: relative;
      .img-box{
        /* #ifdef H5 */
        display: flex;
          /* #endif */
        padding: 20rpx 0;
        position: relative;
        margin: 20rpx -5px 0;
        overflow: hidden;
        .img1{
          flex: 1;
          margin-right: 15rpx;
          height: 312rpx;
        }
        .right-img{
          float: right;
          top:20rpx;
          left: 10rpx;
          image {
            width: 230rpx;
            height: 150rpx;
            display: block;
          }
          .img3{
            margin-top: 15rpx;
          }
        }
      }
      .main{
        font-size: 30rpx;
        margin-top: 10rpx;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
      }
      .msg-info{
        font-size: 22rpx;
        color: #666;
        margin-top: 10rpx;
        .location{
          width: 300rpx;
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          vertical-align: middle;
        }
        .space{
          margin-left: 20rpx;
        }
        .msg{
          float: right;
          margin-right: 5rpx;
          margin-left: 20rpx;
        }
      }
      .like{
        margin-top: 20rpx;
        height: 80rpx;
        .img-flex{
          display: inline-block;
          max-width: 600rpx;
          img{
            width: 60rpx;
            height: 60rpx;
            display: inline-block;
            border-radius: 50%;
            margin-left: -7rpx;
          }
        }
        .omit{
          font-size: 30rpx;
          vertical-align: top;
          margin-left: 10rpx;
        }
        .like-txt{
          color: #333333;
          font-size: 22rpx;
          float: right;
          margin-top: 19rpx;
        }
      }
      .title{
        color: #333333;
        font-size: 30rpx;
        .name-box{
          display: inline-block;
          margin-left: 24rpx;
          font-size: 32rpx;
          vertical-align: middle;
          .data{
            color: #999999;
            font-size: 22rpx;
          }
        }
      }
      .right{
        position: absolute;
        right: 30rpx;
        top: 50rpx;
        color: #388ef8;
        font-size: 30rpx;
      }
      .location-icon, .follow-icon, .msg-icon, .see-icon{
        width: 20rpx;
        height: 20rpx;
        background-position: 0 -62rpx;
        margin-right: 8rpx;
        margin-top: -6rpx;
      }
      .follow-icon{
        background-position: -19rpx -58rpx;
        &.active {
          width: 32rpx;
          height: 35rpx;
          background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACnklEQVRYR+2WS2gTURSG/5O5U1QKIpYiIlgUxZhJiwS66cpFlyrSzlR8lG4URHAjuBFfGBeCuBIX6kZEQietC8WdYJGqSH1AM6kIPuhCECpFkJLWeRyZQGPTPO7c2cSF2QX+77t/DvfeXEKLP9Ti9fG/wL87Ac82jgHoZ6CHgG4GpolRYOCT6OzI0t4Jb+X+4fHuLZ4fnAYjRcS7CdQRMmDMIMGvhVm8W2+/1UyAn3Wt8efabwA42WSDvgJwVVjOkzDj5dMmcZBl0M6GDGFCa3P304GPv1ZmqgqUHqS36Tp/jnoymHE5zBLhYlRGg95J1vu55XxVAdc2ZghIRpXFzD0VltNfU8C1jXMEZGNKlTAiPqWZxVvl6S2Tvp1+x+A9SqaY4XBz6pbTUynAjzPr/NLSQkxfLOzHYqJ90/D0QnkCv+10JgF+E8sUEwoC7m07VJwqFyjldnXpmvga0xUL0xK0nQYLXyp7wBs15kHYEMumDv0UllNeq1LAtY1JAvrUXeoEAy91yymv9XcCdmoQoLy6Lg7BprCKY1UFwi9ePn0bzMfjKCMzRHeEWThR9yYsjSe36n5iAqCuyEK14FtX8wfWDnyYrVtgxaX0jcGb1dzS9LywnI2rUw3fA55tPAKwT6qNEGDGlD7k9NaLNn2QuKPGJZV/urpdiHLCLBxu1FP6IvJs4yCAhxF+aE2EiK5oZuFCM1ZaIITd0VQfEU0qlWAeEUPFezImUoFQwmPJHX6g5QBkJNJZTeMjNFB8IVu85h6QAWxn1vu8dBOEow2yzxcRDLVbM99lrqbHUAb7eeM6M86syt0XljMsYyMfQ5nIz6fOMtO18hiJsppZOC9jlI+hTOjZ6RFQIBo9uWW88h6IIlTNRD4FquKo+ZYX+AP1jMghngiQ8wAAAABJRU5ErkJggg==") no-repeat;
          background-size: 100%;
        }
      }
      .msg-icon{
        background-position: -50rpx -59rpx;
      }
      .see-icon{
        background-position: -75rpx -63rpx;
        width: 25rpx;
      }
      .follow-btn{
        border: 1rpx solid #41a0fc;
        border-radius: 30rpx;
        color: #41a0fc;
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
    }
    .my-look-around-box{
      .date{
        margin: 30rpx;
        position: relative;
        .year{
          font-size: 36rpx;
        }
        .calendar{
          position: absolute;
          right: 0 ;
          top: 10rpx;
        }
        .calendar-icon{
          background: url('../../../../static/travelShop/images/travelPerson/guide.png');
          background-size: 200rpx 200rpx;
          display: inline-block;
          vertical-align: middle;
          width: 38rpx;
          height: 38rpx;
          background-position: 0 -147rpx;
          text-align: center;
          font-size: 24rpx;
          padding-top: 2px;
    
        }
      }
    }
    .icon{
      background: url('../../../../static/travelShop/images/travelPerson.png');
      background-size: 200rpx 100rpx;
      width: 20rpx;
      height: 35rpx;
      display: inline-block;
      vertical-align: middle;
    }
    swiper {
      height: 460rpx;
    }
    .img-pic-flex {
      position: relative;
      width: 100%;
      flex-wrap: wrap;
      padding: 0 10rpx;
      .img {
        width: 100%;
        height: 460rpx;
      }
    }
    .indicator-wrap {
      position: absolute;
      right: 20rpx;
      bottom: 20rpx;
      color: #fff;
      background-color: rgba(0, 0, 0, .4);
      -webkit-border-radius: 30rpx;
      -moz-border-radius: 30rpx;
      border-radius: 30rpx;
      line-height: 1;
      padding: 10rpx 20rpx;
    }
    .page-wrap {
      padding-top: 89rpx;
    }
    .look-btn {
      position: fixed;
      bottom: 100rpx;
      right: 60rpx;
      width: 100rpx;
      height: 100rpx;
      background: url('../../../../static/travelShop/images/common/causelook_btn.png');
      background-size: 100%;
      z-index: 999;
    }
    .social-box{
      height: 98rpx;
      line-height: 98rpx;
      border-top: 1rpx solid #dcdcdc;
      /* #ifdef H5 */
        display: flex;
          /* #endif */
      box-sizing: border-box;
      padding: 0 60rpx;
      justify-content:space-between;
      .social-item{
        width: 33.333%;
        font-size: 28rpx;
        color: #666666;
        background: transparent;
        padding: 0;
        line-height: 98rpx;
        text-align: center;
        .zf-icon{
          background-position: -83rpx -57rpx;
          width: 33rpx;
          height: 33rpx;
          margin-right: 15rpx;
        }
        .dz-icon{
          background-position: -19rpx -58rpx;
          width: 33rpx;
          height: 33rpx;
          margin-right: 15rpx;
          vertical-align: middle;
          &.active {
            width: 33rpx;
            height: 33rpx;
            background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACnklEQVRYR+2WS2gTURSG/5O5U1QKIpYiIlgUxZhJiwS66cpFlyrSzlR8lG4URHAjuBFfGBeCuBIX6kZEQietC8WdYJGqSH1AM6kIPuhCECpFkJLWeRyZQGPTPO7c2cSF2QX+77t/DvfeXEKLP9Ti9fG/wL87Ac82jgHoZ6CHgG4GpolRYOCT6OzI0t4Jb+X+4fHuLZ4fnAYjRcS7CdQRMmDMIMGvhVm8W2+/1UyAn3Wt8efabwA42WSDvgJwVVjOkzDj5dMmcZBl0M6GDGFCa3P304GPv1ZmqgqUHqS36Tp/jnoymHE5zBLhYlRGg95J1vu55XxVAdc2ZghIRpXFzD0VltNfU8C1jXMEZGNKlTAiPqWZxVvl6S2Tvp1+x+A9SqaY4XBz6pbTUynAjzPr/NLSQkxfLOzHYqJ90/D0QnkCv+10JgF+E8sUEwoC7m07VJwqFyjldnXpmvga0xUL0xK0nQYLXyp7wBs15kHYEMumDv0UllNeq1LAtY1JAvrUXeoEAy91yymv9XcCdmoQoLy6Lg7BprCKY1UFwi9ePn0bzMfjKCMzRHeEWThR9yYsjSe36n5iAqCuyEK14FtX8wfWDnyYrVtgxaX0jcGb1dzS9LywnI2rUw3fA55tPAKwT6qNEGDGlD7k9NaLNn2QuKPGJZV/urpdiHLCLBxu1FP6IvJs4yCAhxF+aE2EiK5oZuFCM1ZaIITd0VQfEU0qlWAeEUPFezImUoFQwmPJHX6g5QBkJNJZTeMjNFB8IVu85h6QAWxn1vu8dBOEow2yzxcRDLVbM99lrqbHUAb7eeM6M86syt0XljMsYyMfQ5nIz6fOMtO18hiJsppZOC9jlI+hTOjZ6RFQIBo9uWW88h6IIlTNRD4FquKo+ZYX+AP1jMghngiQ8wAAAABJRU5ErkJggg==") no-repeat;
            background-size: 100%;
          }
        }
        .pl-icon{
          background-position: -50rpx -59rpx;
          width: 35rpx;
          height: 33rpx;
          margin-right: 15rpx;
        }
        &:last-child {
          text-align: right;
        }
        &:first-child {
          text-align: left;
        }
      }
      button.social-item {
        text-align: left;
      }
      button.social-item::after {
        display: none;
      }
    }
      .forwardCasualLook-wrap.look-around-box {
        margin: 0 -30rpx;
        background-color: #f4f4f4;
        padding: 10rpx 30rpx 0 30rpx;
        overflow: hidden;
        .social-box {
          /* #ifdef H5 */
        display: flex;
          /* #endif */
          text-align: right;
          justify-content: right;
          padding: 0;
          float: right;
          height: auto;
          border-top: 0;
          .social-item {
            width: 160rpx;
            text-align: right;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            line-height: 1;
            padding: 20rpx;
          }
        }
      }
      .forwardContent-text {
        padding: 30rpx 0;
      }
</style>
