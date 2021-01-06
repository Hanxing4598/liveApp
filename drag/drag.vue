<template>
	<view>
		<view :style="{'overflow-x':  overOnePage ? 'hidden' : 'initial'}">
			<view class="item-wrap" :style="{height: itemWrapHeight + 'px'}">
				<view v-for="(item1,index) in list" :key="index" :id="'item' + index" :index="index" :style="{'transform': 'translate3d('+ (index === cur ? tranX : item1.tranX) +'px,'+ (index === cur ? tranY: item1.tranY) +'px,0px)', width: 100 / columns + '%'}"
				 :class="['item', cur === index? 'cur':'', curZ === index? 'zIndex':'', itemTransition && index !== cur ? 'itemTransition':'', item1.fixed ? 'fixed':'']"
				 @click.stop="itemClick($event,item1,index)" @longpress="longPress($event,item1,index)" @touchmove.stop="touchMove($event,item1,index)"
				 @touchend.stop="touchEnd($event,item1,index)">

					<!-- start:请在该区域编写自己的渲染逻辑 -->
					<view class="info" v-if="columns >= 2">
						<view class="info__item">
							<image class="image" :src="item1.data.images"></image>
							<view class="close" @click.stop="remove($event,item1,index)">
								<uni-icons color="#ffffff" type="close"></uni-icons>
							</view>
						</view>
					</view>
					<!-- end:请在该区域编写自己的渲染逻辑 -->

				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "drag",
		props: {
			// 数据源
			listData: {
				type: Array,
				value: []
			},
			// 列数
			columns: {
				type: Number,
				default () {
					return 1;
				}
			},
			// 顶部高度
			top: {
				type: Number,
				default () {
					return 0;
				}
			},
			// 底部高度
			bottom: {
				type: Number,
				default () {
					return 0;
				}
			}
		},
		data() {
			return {
				item: null,
				cur: -1, // 当前激活的元素
				curZ: -1, // 当前激活的元素, 用于控制激活元素z轴显示
				tranX: 0, // 当前激活元素的 X轴 偏移量
				tranY: 0, // 当前激活元素的 Y轴 偏移量
				olX: 0, // 激活元素起始的 X轴 偏移量
				olY: 0, // 激活元素起始的 Y轴 偏移量
				itemWrapHeight: 0, // 动态计算父级元素高度
				dragging: false, // 是否在拖拽中
				list: [],
				topSize: 0,
				bottomSize: 0,
				overOnePage: false, // 整个区域是否超过一个屏幕
				itemTransition: false, // item 变换是否需要过渡动画, 首次渲染不需要
			}
		},
		watch: {
			top(newData) {
				this.topSize = newData;
				this.dataChange();
			},
			bottom(newData) {
				this.bottomSize = newData;
				this.dataChange();
			},
			listData() {
				this.dataChange();
			},
			columns() {
				this.dataChange();
			}
		},
		created() {
			this.topSize = this.top;
		},
		mounted() {
			this.init();
		},
		methods: {
			remove(e, item, index) {
				this.$emit('remove', {
					oldKey: index,
					newKey: item.key,
					data: item.data
				});
			},
			/**
			 * 长按触发移动排序
			 */
			longPress(e, item, index) {
				// 防止多指触发 drag 动作, 如果已经在 drag 中则返回, touchstart 事件中有效果
				if (this.dragging) return;
				// 如果是固定 item 则 return
				if (this.isFixed(index)) return;
				// 存储初始化触摸点信息
				this.startTouch = e.changedTouches[0];
				// 如果未获取到触摸点信息 return
				if (!this.startTouch) return;
				// 表示 drag 动作开始
				this.dragging = true;
				// 获取初始化点的 pageX 和 pageY
				let {
					pageX: startPageX,
					pageY: startPageY
				} = this.startTouch;
				if (this.columns === 1) { // 单列时候X轴初始不做位移
					this.tranX = 0;
				} else { // 多列的时候计算X轴初始位移, 使 item 水平中心移动到点击处
					this.tranX = startPageX - this.item.width / 2 - this.itemWrap.left;
				}
				// 计算Y轴初始位移, 使 item 垂直中心移动到点击处
				this.tranY = startPageY - this.item.height / 2 - this.itemWrap.top;
				this.cur = index;
				this.curZ = index;
				this.olX = this.tranX;
				this.olY = this.tranY;
				// wx.vibrateShort();
			},
			touchMove(e, item, index) {
				// 如果不在 drag 中则返回
				if (!this.dragging) return;
				let currentTouch = e.changedTouches[0];
				// 如果未获取到触摸点信息 return
				if (!currentTouch) return;
				// 获取初始化点的 pageX , pageY 以及标示符 identifier
				let {
					pageX: startPageX,
					pageY: startPageY,
					identifier: startId
				} = this.startTouch;
				let {
					pageX: currentPageX,
					pageY: currentPageY,
					identifier: currentId,
					clientY: currentClientY
				} = currentTouch;
				// 如果不是同一个触发点则返回
				if (startId != currentId) return;
				// 通过 当前坐标点, 初始坐标点, 初始偏移量 来计算当前偏移量
				let tranX = currentPageX - startPageX + this.olX,
					tranY = currentPageY - startPageY + this.olY;
				// 单列时候X轴初始不做位移
				if (this.columns === 1) tranX = 0;
				// 判断是否超过一屏幕, 超过则需要判断当前位置动态滚动page的位置
				if (this.overOnePage) {
					if (currentClientY > this.windowHeight - this.item.height - this.bottomSize) {
						// 当前触摸点pageY + item高度 - (屏幕高度 - 底部固定区域高度)
						wx.pageScrollTo({
							scrollTop: currentPageY + this.item.height - (this.windowHeight - this.bottomSize),
							duration: 300
						});
					} else if (currentClientY < this.item.height + this.topSize) {
						// 当前触摸点pageY - item高度 - 顶部固定区域高度
						wx.pageScrollTo({
							scrollTop: currentPageY - this.item.height - this.topSize,
							duration: 300
						});
					}
				}
				// 设置当前偏移量
				this.tranX = tranX;
				this.tranY = tranY;
				// 获取当前的起始坐标
				let originKey = item.key;
				// 根据偏移量计算得出目标坐标
				let endKey = this.calculateMoving(tranX, tranY);
				// 如果是固定 item 则 return
				if (this.isFixed(endKey)) return;
				// 防止拖拽过程中发生乱序问题
				if (originKey == endKey || this.originKey == originKey) return;
				this.originKey = originKey;
				// 触发排序
				this.insert(originKey, endKey);
			},
			touchEnd() {
				if (!this.dragging) return;
				this.clearData();
			},
			/**
			 * 判断是否是固定的 item
			 */
			isFixed(key) {
				let list = this.list;
				if (list && list[key] && list[key].fixed) {
					return true
				}
				return false
			},
			/**
			 * 清除参数
			 */
			clearData() {
				this.originKey = -1;
				this.dragging = false;
				this.cur = -1;
				this.tranX = 0;
				this.tranY = 0;
				// 延迟清空
				setTimeout(() => {
					this.curZ = -1;
				}, 300)
			},
			/**
			 * 根据排序后 list 数据进行位移计算
			 */
			getPosition(data, vibrate = true) {
				let list = data.map((item, index) => {
					item.tranX = this.item.width * (item.key % this.columns);
					item.tranY = Math.floor(item.key / this.columns) * this.item.height;
					return item
				});
				this.list = list;

				if (!vibrate) return;
				// if(this.platform != "devtools") wx.vibrateShort();
				let listData = [];
				list.forEach((item) => {
					listData[item.key] = item.data
				});
				this.$emit('change', {
					listData: listData
				});
			},
			/**
			 * 正序拖动 key 值和固定项判断逻辑
			 */
			l2r(key, origin) {
				if (key == origin) return origin;
				if (this.list[key].fixed) {
					return this.l2r(key - 1, origin);
				} else {
					return key;
				}
			},
			/**
			 * 倒序拖动 key 值和固定项判断逻辑
			 */
			r2l(key, origin) {
				if (key == origin) return origin;
				if (this.list[key].fixed) {
					return this.r2l(key + 1, origin);
				} else {
					return key;
				}
			},
			/**
			 * 根据起始key和目标key去重新计算每一项的新的key
			 */
			insert(origin, end) {
				this.itemTransition = true;
				let list;
				if (origin < end) { // 正序拖动
					list = this.list.map((item) => {
						if (item.fixed) return item;
						if (item.key > origin && item.key <= end) {
							item.key = this.l2r(item.key - 1, origin);
						} else if (item.key == origin) {
							item.key = end;
						}
						return item
					});
					this.getPosition(list);
				} else if (origin > end) { // 倒序拖动
					list = this.list.map((item) => {
						if (item.fixed) return item;
						if (item.key >= end && item.key < origin) {
							item.key = this.r2l(item.key + 1, origin);
						} else if (item.key == origin) {
							item.key = end;
						}
						return item
					});
					this.getPosition(list);
				}
			},
			/**
			 * 根据当前的手指偏移量计算目标key
			 */
			calculateMoving(tranX, tranY) {
				let rows = Math.ceil(this.list.length / this.columns) - 1,
					i = Math.round(tranX / this.item.width),
					j = Math.round(tranY / this.item.height);
				i = i > (this.columns - 1) ? (this.columns - 1) : i;
				i = i < 0 ? 0 : i;
				j = j < 0 ? 0 : j;
				j = j > rows ? rows : j;
				let endKey = i + this.columns * j;
				endKey = endKey >= this.list.length ? this.list.length - 1 : endKey;
				return endKey
			},
			/**
			 * 监听列数变化, 如果改变重新初始化参数
			 */
			dataChange(newVal, oldVal) {
				setTimeout(() => {
					wx.pageScrollTo({
						scrollTop: 0,
						duration: 0
					});
					this.clearData();
					this.init()
				}, 0)
			},
			/**
			 * 点击每一项后触发事件
			 */
			itemClick(e, item, index) {
				this.$emit('click', {
					oldKey: index,
					newKey: item.key,
					data: item.data
				});
			},
			init() {
				// 遍历数据源增加扩展项, 以用作排序使用
				let list = this.listData.map((item, index) => {
					let data = {
						fixed: item.fixed,
						key: index,
						tranX: 0,
						tranY: 0,
						data: item
					}
					return data;
				});
				this.list = list;
				this.itemTransition = false;
				let {
					windowWidth,
					windowHeight,
					platform
				} = wx.getSystemInfoSync();
				this.windowHeight = windowHeight;
				this.platform = platform;
				// 根据屏幕比例计算对应的 topSize 和 bottomSize 实际高度
				let remScale = windowWidth / 750;
				this.topSize = this.topSize * remScale;
				this.bottomSize = this.bottomSize * remScale;

				setTimeout(() => {
					// 获取每一项的宽高等属性
					this.createSelectorQuery().select(".item").boundingClientRect((res) => {

						let rows = Math.ceil(this.list.length / this.columns);
						this.item = res;
						this.getPosition(this.list, false);
						let itemWrapHeight = rows * res.height;
						this.itemWrapHeight = itemWrapHeight;

						this.createSelectorQuery().select(".item-wrap").boundingClientRect((res) => {
							this.itemWrap = res;
							// (列表的底部到页面顶部距离 > 屏幕高度 - 底部固定区域高度) 用该公式来计算是否超过一页
							let overOnePage = res.bottom > this.windowHeight - this.bottomSize;
							this.overOnePage = overOnePage;

						}).exec();
					}).exec();
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	// @import "../../static/travelShop/css/variables";
	$mainColor: #3F82FD;
	$mainColorActive: rgba($mainColor, 0.7);
	$mainBd: #f7f7f7;
	$hoverBd: #eeeeee;
	$mainBlack1: #333333;
	$mainBlack2: #666666;
	$mainBlack3: #999999;
	$lineColor: #ebedf0;
	$shadow: 0 0 20rpx -5rpx rgba(0, 0, 0, 0.1);

	%clear-float {
		&:after {
			display: block;
			content: "clear";
			height: 0;
			clear: both;
			overflow: hidden;
			visibility: hidden;
		}
	}

	.close {
		position: absolute;
		right: $uni-spacing-row-sm;
		top: 0;
		padding-top: 15rpx;
	}

	@mixin line($line: 1) {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: $line;
		overflow: hidden;
		word-break: break-all;
	}

	.item-wrap {
		position: relative;

		.item {
			position: absolute;
			width: 100%;
			z-index: 1;

			&.itemTransition {
				transition: transform 0.3s;
			}

			&.zIndex {
				z-index: 2;
			}

			&.cur {
				transition: initial;
			}

			&.fixed {
				z-index: 0 !important;
			}
		}
	}

	.info {
		position: relative;
		padding-top: 100%;
		background: #ffffff;

		&__item {
			position: absolute;
			// border: 1rpx solid $uni-theme-color;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			overflow: hidden;
			padding: 5rpx;
			box-sizing: border-box;
			border-radius: $uni-border-radius-lg;

			.image {
				width: 100%;
				border-radius: $uni-border-radius-lg;
				height: 100%;
			}
		}
	}

	.cell {
		display: flex;
		padding: 20rpx;
		border-bottom: 1rpx solid $lineColor;
		background: #FFFFFF;

		&__hd {
			font-size: 0;

			.image {
				width: 160rpx;
				height: 160rpx;
				margin-right: 20rpx;
				border-radius: 12rpx;
			}
		}

		&__bd {
			flex: 1;

			.name {
				@include line(2);
				font-size: 28rpx;
				margin-bottom: 12rpx;
			}

			.des {
				@include line(2);
				color: $mainBlack2;
				font-size: 24rpx;
			}
		}
	}
</style>
