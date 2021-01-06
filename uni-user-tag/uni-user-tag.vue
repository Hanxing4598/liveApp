<template>
	<view class="user-tag">
		<image :src="url" mode="widthFix"></image>
	</view>
</template>

<script>
	export default {
		name: "UniUserTag",
		props: {
			type: {
				type: String,
				default: "小鹿用户"
			}
		},
		data() {
			return {
				url: ''
			}
		},
		created() {
			let url
			switch (this.type) {
				case '小鹿用户':
					url = '/static/tag/tag-mr.png'
					break
				case '带货主播':
					url = '/static/tag/tag-zb.png'
					break
				case '企业用户':
					url = '/static/tag/tag-qiye.png'
					break
				case '城市代理商':
					url = '/static/tag/tag-dls.png'
					break
				case '认证商家':
					url = '/static/tag/tag-sj.png'
					break
			}
			this.url = url
		}
	}
</script>

<style lang="scss" scoped>
	.user-tag {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		bottom: -10rpx;
		z-index: 1;

		image {
			width: 100%;
			background: none;
			height: auto;
		}
	}
</style>
