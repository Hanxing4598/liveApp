<template>
  <div>
    <div :class="'mask ' + (showModal?'show':'')" @click="closeModal"></div>
    <div :class="'modal-wrapper '+ (showModal?'show':'')">
      <div class="modal-header">已报名<i class="icon-close" @click="closeModal"></i></div>
      <scroll-view scroll-y class="modal-content">
        <div :class="'item' + (item.showContent ? 'no-border':'')" v-for="item in dataList">
          <div class="text-wrap" @click="toggleContent(item)">
            <span>电话: {{item.mobile}}</span>
            <i :class="'arrow-icon ' + (item.showContent ? 'icon-down':'icon-up')"></i>
          </div>
          <div :class="'content ' + (item.showContent ? '':'none')">
            <p class="text">性别：{{item.sex}}</p>
            <p class="text">微信：{{item.wechat}}</p>
            <p class="text">留言：{{item.remark}}</p>
          </div>
        </div>
        <div class="look-more" @click="loadMore" v-if="!loadEnd">查看更多</div>
      </scroll-view>
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
      },
      loadEnd: {
        type: Boolean,
        default() {
          return false
        }
      }
    },
    data() {
      return {
        dataList: this.list,
        showModal: false
      }
    },
    created() {
      this.dataList.forEach(item => {
        // 新增一个字段，显示隐藏内容
        this.$set(item, 'showContent', false)
      })
      setTimeout(() => {
        this.showModal = true
      }, 20)
    },
    methods: {
      toggleContent(item) {
        item.showContent = !item.showContent
      },
      closeModal() {
        this.showModal = false
        this.$emit('close')
        setTimeout(() => {
          this.$emit('closed')
          this.dataList.forEach(item => {
            this.$set(item, 'showContent', false)
          })
        }, 300)
      },
      loadMore() {
        this.$emit('loadMore')
      }
    }
  }
</script>
<style lang="scss" scoped>
  .modal-wrapper {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 100;
    flex-direction: column;
    max-height: 50vh;
    transform: translateY(100%);
    transition: all .3s linear;
    &.show {
      transform: translateY(0);
    }
  }
  .modal-content {
    flex: 1;
    width: 100%;
    padding: 0 20rpx;
    box-sizing: border-box;
    background-color: #fff;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    .item {
      padding: 0 20rpx;
      border-bottom: 1px solid #dcdcdc;
    }
    .text-wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 78rpx;
      padding: 0 20rpx;
      line-height: 78rpx;
    }
    .content {
      padding: 14rpx 20rpx;
      border: 1px solid #666;
      border-radius: 4rpx;
      .text {
        margin-bottom: 18rpx;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
  .arrow-icon {
    width: 32rpx;
    height: 32rpx;
  }
  .icon-down {
    background: url("./icon/down.png") no-repeat;
    background-size: 100%;
  }
  .icon-up {
    background: url("./icon/up.png") no-repeat;
    background-size: 100%;
  }
  .modal-header {
    position: relative;
    height: 70rpx;
    line-height: 70rpx;
    background-color: #eeeeee;
    text-align: center;
    border-radius: 20rpx 20rpx 0 0;
  }
  .icon-close {
    position: absolute;
    right: 20rpx;
    width: 32rpx;
    height: 32rpx;
    top: 50%;
    margin-top: -16rpx;
    background: url("./icon/close.png") no-repeat;
    background-size: 100%;
  }
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99;
    background-color: transparent;
    transition: all .3s linear;
    &.show {
      background-color: rgba(0, 0, 0, .3);
    }
  }
  .none {
    display: none !important;
  }
  .look-more {
    line-height: 70rpx;
    text-align: center;
    color: #feb312;
  }
  .no-border {
    border-bottom: none !important;
  }
</style>
