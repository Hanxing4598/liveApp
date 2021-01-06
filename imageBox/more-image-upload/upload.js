const uploadImage = (params) => { //上传多张图片
	return new Promise((presolve, preject) => {
		let uploads = [];
		console.log(params);
		(params.tempFilePaths).forEach((item, i) => {
			uploads[i] = new Promise((resolve) => {
				uni.uploadFile({
					url:params.url,
					filePath: item,
					name: params.uploadname,
					formData: {
						'Filedata': item
					},
					header:params.headers,
					success(res) {
						// resolve(JSON.parse(res.data).url)
						console.log('1122',JSON.parse(res.data));
						// resolve('http://www.xue.com/' + JSON.parse(res.data).data.returnurl)
						// console.log(JSON.parse(res.data).url);
						if(JSON.parse(res.data).state == 'SUCCESS'){
							resolve(JSON.parse(res.data).url)
						}else{
							resolve(JSON.parse(res.data).state)
						}
					},
					fail(err) {
						console.log(err)
						uni.hideLoading()
					}
				})
			})
		})

		Promise.all(uploads).then(res => {
			//图片上传完成
			presolve(res)
			uni.hideLoading()
		}).catch(err => {
			preject(err)
			uni.hideLoading()
			uni.showToast({
				title: '上传失败请重试',
				icon: 'none'
			})
		})
	})
}
export default uploadImage
module.exports = {
	uploadImage
}