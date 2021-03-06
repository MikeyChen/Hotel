// pages/me/index/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },
  clickJudge:function(e){
    //获取url
    var that = this;
    
    var url = e.currentTarget.dataset.url;
    //登录验证
    var loginConfirm = app.globalData.loginConfirm;
    loginConfirm(url);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    //登录状态验证
    wx.request({
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      url: app.globalData.webSite + '/Home/Wechat/userLoginStatusConfirm',
      data: { open_id: app.globalData.openId },
      success: function (res) {
        var data = res.data;
        if (data.code == '200') {
          app.globalData.loginStatus = true;
          app.globalData.userInfo.score = data.data.score;
          app.globalData.userInfo.phone = data.data.phone;
        }
        console.log(app);
      }
    });

    var score = app.globalData.userInfo.score;

    if (app.globalData.loginStatus == false) {
      wx.navigateTo({
        url: '/pages/login/index'
      })
    };
    wx.getUserInfo({
      success: function (res) {
        var userInfo = res.userInfo
        var nickName = userInfo.nickName
        var avatarUrl = userInfo.avatarUrl
        var gender = userInfo.gender //性别 0：未知、1：男、2：女
        var province = userInfo.province
        var city = userInfo.city
        var country = userInfo.country
        console.log(res);
        that.setData({
          userImage: avatarUrl,
          userName: nickName,
          score:score
        });
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})