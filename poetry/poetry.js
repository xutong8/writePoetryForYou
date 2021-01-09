const app = getApp()

Page({
  data: {
    words: [],
    rhyme: 0
  },
  onLoad() {
    const self = this;
    const eventChannel = this.getOpenerEventChannel();
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('sendWords', function (data) {
      self.setData({
        words: data.words,
        rhyme: data.rhyme
      });
    });
  },
  onReady() {
    // const data = this.data;
    // const len = data.words.length;
    const query = wx.createSelectorQuery();
    // TODO: 给所有的canvas添加音调
    query.select('#canvas_0').boundingClientRect((canvas) => {
      // select返回的是单个元素
      // selectAll返回的是一个数组
      const ctx = wx.createCanvasContext(canvas.id);
      // console.log('ctx: ', ctx);
      ctx.beginPath();
      ctx.moveTo(75, 50);
      ctx.lineTo(100, 75);
      ctx.lineTo(100, 25);
      ctx.fill();
      // ctx.setLineDash([4, 2]);
      // ctx.beginPath();
      // ctx.moveTo(0, 10);
      // ctx.lineTo(50, 10);
      // ctx.closePath();
      // ctx.stroke();
    }).exec();
  },
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