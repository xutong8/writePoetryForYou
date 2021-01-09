const app = getApp()

Page({
  data: {
    words: [
      '黄', '河', '连', '白', '草',
      '万', '里', '泪', '沾', '霜',
      '落', '雁', '孤', '城', '外',
      '西', '风', '十', '二', '乡'
    ]
  },
  onLoad() {},
  backToPreviousPage() {
    wx.navigateBack({
      url: '/index/index'
    })
  },
  // 发送给好友
  onShareAppMessage() {
    console.log('aa');
    return {
      title: "VAG为你写诗",
      desc: '为你写诗首页',
      path: '/index/index'
    }
  },
  // 朋友圈
  onShareTimeline: function () {
    return {
      title: '朋友圈看到的页面标题',
      path: '/index/index',
      // imageUrl: '分享链接图片',
      // query: 'kjbfrom=pyq'
    }
  }
});