<template>
	<view class="empty-box">
		<image class="empty" src="/static/empty.png" mode="aspectFit"></image>
	</view>
</template>

<script>
	export default {
		name: 'uniEmpty',
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss" scoped>
	.empty-box {
		width: 100%;
		padding: 200rpx 0;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
	}

	.empty {
		/* #ifndef APP-NVUE */
		background: none;
		/* #endif */
		width: 150rpx;
		height: 155rpx;
	}
</style>
