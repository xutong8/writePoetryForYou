import * as echarts from '../ec-canvas/echarts';

const app = getApp()

Page({
  data: {
    emotions: [{
        id: 0,
        isSelected: true,
        text: '思念远方',
        value: 0.5
      },
      {
        id: 1,
        isSelected: true,
        text: '离别不舍',
        value: 0.5
      },
      {
        id: 2,
        isSelected: true,
        text: '深切爱情',
        value: 0.5
      },
      {
        id: 3,
        isSelected: true,
        text: '军旅悲壮',
        value: 0.5
      },
      {
        id: 4,
        isSelected: true,
        text: '忧国忧民',
        value: 0.5
      },
      {
        id: 5,
        isSelected: true,
        text: '咏史怀古',
        value: 0.5
      }
    ],
    ec: {
      // onInit: initChart
      lazyLoad: true
    },
    rhyme: 2,
    pingList: [1, 3, 5, 7, 9]
  },
  onShow() {
    this.setData({
      rhyme: 2
    });
  },
  onReady() {
    this.echartsComponnet = this.selectComponent('#mychart-dom-bar'); //一定要初始化
    this.init_echarts(); //初始化图表
  },
  handleSliderChange(e) {
    const text = e.target.id;
    const emotions = this.data.emotions;
    for (const emotion of emotions) {
      if (emotion.text === text) {
        emotion.value = e.detail.value;
      }
    }
    this.init_echarts(); // 重新渲染图表
  },
  handleChangeRhyme(e) {
    this.setData({
      rhyme: Number.parseInt(e.target.id)
    });
  },
  init_echarts() {
    const value = this.data.emotions.map((emotion) => emotion.value);
    this.echartsComponnet.init((canvas, width, height) => {
      // 初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      chart.setOption(this.getOption(value));
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
  },
  getOption(value) {
    const option = {
      radar: {
        // 调整指示器名称与指示器轴的距离
        nameGap: 5,
        name: {
          textStyle: {
            color: '#fff',
            backgroundColor: '#999',
            borderRadius: 3,
            padding: [3, 5]
          }
        },
        indicator: [{
            name: '思念远方',
            max: 1.0,
            min: 0.0
          },
          {
            name: '离别不舍',
            max: 1.0,
            min: 0.0
          },
          {
            name: '深切爱情',
            max: 1.0,
            min: 0.0
          },
          {
            name: '军旅悲壮',
            max: 1.0,
            min: 0.0
          },
          {
            name: '忧国忧民',
            max: 1.0,
            min: 0.0
          },
          {
            name: '咏史怀古',
            max: 1.0,
            min: 0.0
          }
        ]
      },
      series: [{
        type: 'radar',
        data: [{
          value,
          name: '情绪选择'
        }]
      }]
    };
    return option;
  },
  handleSystemProduce() {
    const self = this;
    wx.showLoading({
      title: "正在向后台请求接口..."
    });
    const {
      emotions,
      pingList,
      rhyme
    } = this.data;
    const emotion = emotions.map((emotion) => emotion.value).join(',');
    const len = pingList.length;
    const yun = pingList[Math.floor(Math.random() * len)];
    wx.request({
      url: `http://xt2021.liujl.com:8001/mode_1/writePoems?emotion=${emotion}&yun=${yun}&rhyme=${rhyme}`,
      method: 'GET',
      timeout: 4000,
      fail() {
        console.log('writePoem接口调用失败了...');
        wx.hideLoading({
          success: (res) => {},
        })
      },
      success(res) {
        const poems = res.data.poem;
        const words = poems.flat(1);
        for (let i = 0; i < poems.length; i++) {
          poems[i] = poems[i].join('');
        }
        const poem = poems.join('|');
        wx.request({
          url: `http://xt2021.liujl.com:8001/mode_1/analysePoem?emotion=0,0,1,0,0,0&poem=${poem}&yun=${yun}&rhyme=${rhyme}`,
          method: 'GET',
          timeout: 4000,
          fail() {
            console.log('analysePoem接口调用失败了...');
            wx.hideLoading({
              success: (res) => {},
            })
          },
          success(res) {
            const {
              continuity_score,
              emotion_score,
              rhyme_score
            } = res.data;
            wx.hideLoading({
              success: () => {
                wx.navigateTo({
                  url: '/poetry/poetry',
                  success(res) {
                    res.eventChannel.emit('sendWords', {
                      words,
                      rhyme,
                      continuity_score,
                      emotion_score,
                      rhyme_score
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  }
})