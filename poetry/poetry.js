import ping from '../files/平水韵.js';
import yun from '../files/韵母2声调.js';

const app = getApp()

Page({
  data: {
    words: [],
    rhyme: 2,
    canvasWidth: 0,
    continuity_score: 0,
    emotion_score: 0,
    rhyme_score: 0
  },
  onLoad() {
    const self = this;
    const eventChannel = this.getOpenerEventChannel();
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('sendWords', function (data) {
      self.setData({
        words: data.words,
        rhyme: data.rhyme,
        continuity_score: Math.round(data.continuity_score * 10) / 10,
        emotion_score: Math.round(data.emotion_score * 10) / 10,
        rhyme_score: Math.round(data.rhyme_score * 10) / 10
      });
      wx.getSystemInfo({
        success: (res) => {
          const ratio = res.windowWidth / 750;
          const w = res.windowWidth - 120 * ratio;
          self.setData({
            canvasWidth: w * (data.rhyme === 0 ? 0.10 : 0.12)
          });
        },
      })
    });
  },
  drawRhyme(ctx, value) {
    const START_X = 0;
    const END_X = this.data.canvasWidth;
    ctx.save();

    ctx.setLineDash([3, 1]);
    ctx.lineWidth = 1.0;
    ctx.globalAlpha = 0.5;

    const yValues = [5, 10, 15, 20, 25];

    for (let yValue of yValues) {
      ctx.beginPath();
      ctx.moveTo(START_X, yValue);
      ctx.lineTo(END_X, yValue);
      ctx.closePath();
      ctx.stroke();
    }

    const startPoint = {
      x: 0,
      y: 0
    };
    const endPoint = {
      x: 0,
      y: 0
    };

    if (value === 1) {
      startPoint.x = START_X + 5;
      startPoint.y = 5;
      endPoint.x = END_X - 5;
      endPoint.y = 5;
    } else if (value === 2) {
      startPoint.x = START_X + 5;
      startPoint.y = 15;
      endPoint.x = END_X - 5;
      endPoint.y = 5;
    } else if (value === 3) {
      ctx.restore();
      ctx.lineCap = 'round';
      ctx.lineWidth = 1.0;

      ctx.beginPath();
      ctx.arc(5, 20, 2, 0, 2 * Math.PI * 2, false);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(5, 20);
      ctx.lineTo(10, 25);
      ctx.closePath();
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(10, 25, 2, 0, 2 * Math.PI * 2, false);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(8, 25);
      ctx.lineTo(35, 10);
      ctx.closePath();
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(35, 10, 2, 0, 2 * Math.PI * 2, false);
      ctx.closePath();
      ctx.fill();

      ctx.draw();

      return;
    } else if (value === 4) {
      startPoint.x = START_X + 5;
      startPoint.y = 5;
      endPoint.x = END_X - 5;
      endPoint.y = 25;
    }

    ctx.restore();
    ctx.lineCap = 'round';
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(endPoint.x, endPoint.y);
    ctx.closePath();
    ctx.stroke();

    ctx.lineCap = 'round';
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.arc(endPoint.x, endPoint.y, 2, 0, 2 * Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();

    ctx.draw();
  },
  onReady() {
    const data = this.data;
    const len = data.words.length;
    for (let i = 0; i < len; i++) {
      const query = wx.createSelectorQuery();
      query.select(`#canvas_${i}`).boundingClientRect((canvas) => {
        // select返回的是单个元素
        // selectAll返回的是一个数组
        const ctx = wx.createCanvasContext(canvas.id);
        const word = this.data.words[i];

        let value = -1;
        for (const pingKey of Object.keys(ping)) {
          if (ping[pingKey].indexOf(word) !== -1) {
            value = yun[pingKey.substr(-3, 1)];
          }
        }

        this.drawRhyme(ctx, value);
      }).exec();
    }
  },
  backToPreviousPage() {
    wx.navigateBack({})
  },
  // 发送给好友
  onShareAppMessage() {
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