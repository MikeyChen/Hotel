// pages/hotel/order_pay/index.js
var app = getApp();
var MD5 = require('../../../libs/crypto/md5.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var price;

    // that.setData({
    //   result: options.result
    // });
    wx.getStorage({
      key: 'orderList',
      success: function (res) {
        that.setData({
          price: res.data.price
        })
      }
    })
  },

  switchTab:function(e){
    var that = this;
    wx.getStorage({
      key: 'orderList',
      success: function(res) {
        var  now_score= res.data.now_score;
        wx.getStorage({
          key: 'spec',
          success: function (spec) {
            console.log('pay!!!!!!!!!!!!!!!!!!!!!!!!!');
            //微信支付参数生成方法
            var payArr = {
              appid: app.globalData.appid,
              mch_id: '1488832592',
              nonce_str: app.globalData.randomString(),
              body: '云南悦途酒店管理有限公司-嘉优隆酒店预定',
              openid: app.globalData.openId,
              out_trade_no: app.globalData.outTradeNo(),
              total_fee: 1,
              spbill_create_ip: '127.0.0.1',
              notify_url: app.globalData.webSite + '/Home/Admin/wecahtPayBack',
              trade_type: 'JSAPI'
            }
            //生成sign (签名)
            var sign = 'appid=' + payArr.appid +
              '&body=' + payArr.body +
              '&mch_id=' + payArr.mch_id +
              '&nonce_str=' + payArr.nonce_str +
              '&notify_url=' + payArr.notify_url +
              '&openid=' + payArr.openid +
              '&out_trade_no=' + payArr.out_trade_no +
              '&spbill_create_ip=' + payArr.spbill_create_ip +
              '&total_fee=' + payArr.total_fee +
              '&trade_type=' + payArr.trade_type +
              '&key=' + 'G1524ghj861473f42h5s7211cr5FG261';

            console.log('拼接Key');
            console.log(sign);

            //统一下单
            wx.request({
              url: app.globalData.webSite + '/Home/Admin/keyMD5',
              data: {sign: sign},
              success: function(res) {
                payArr.sign = res.data.toUpperCase();

                console.log(payArr);

                wx.request({
                  header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  },
                  method: 'POST',
                  url: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
                  data: "<xml>" +
                  "<appid><![CDATA[" + payArr.appid + "]]></appid>" +
                  "<body><![CDATA[" + payArr.body + "]]></body>" +
                  "<mch_id><![CDATA[" + payArr.mch_id + "]]></mch_id>" +
                  "<nonce_str><![CDATA[" + payArr.nonce_str + "]]></nonce_str>" +
                  "<notify_url><![CDATA[" + payArr.notify_url + "]]></notify_url>" +
                  "<openid><![CDATA[" + payArr.openid + "]]></openid>" +
                  "<out_trade_no><![CDATA[" + payArr.out_trade_no + "]]></out_trade_no>" +

                  "<spbill_create_ip><![CDATA[" + payArr.spbill_create_ip + "]]></spbill_create_ip>" +
                  "<total_fee><![CDATA[" + payArr.total_fee + "]]></total_fee>" +
                  "<trade_type><![CDATA[" + payArr.trade_type + "]]></trade_type>" +
                  "<sign><![CDATA[" + payArr.sign + "]]></sign>" +
                  "</xml>",
                  success: function (res) {
                      var xmlData = res.data;

                      //XML解析单条数据
                      var xmlStr1 = '<prepay_id>';
                      var xmlStr2 = '</prepay_id>';

                      xmlData = xmlData.split(xmlStr1);
                      xmlData = xmlData[1].split(xmlStr2);
                      xmlData = xmlData[0].split('<![CDATA[');
                      xmlData = xmlData[1].split(']]>');
                      var prepay_id = xmlData[0]; //最后数据(值)

                      //发起微信支付
                      var timestamp = Date.parse(new Date()); //当前时间戳
                      wx.requestPayment({
                        timeStamp: timestamp.toString(),
                        nonceStr: payArr.nonce_str,
                        package: 'prepay_id=' + prepay_id,
                        signType: 'MD5',
                        paySign: payArr.sign,
                        success: function(res) {
                            console.log('{{{{{{{{{{{{{{{{{{{{{{');
                            console.log(res);
                            console.log('}}}}}}}}}}}}}}}}}}}}}}');
                        },
                        fail: function() {
                          console.log('------------------------');
                          console.log(res);
                          console.log('++++++++++++++++++++++++');
                        }
                      });
                  }
                });
              }
            })

           


            // console.log('-----------------------------');
            // console.log(spec);
            // //生成order_number
            // var order_number = '';
            // for (var i = 0; i < 32; i++) {
            //   order_number += parseInt(Math.random() * 10)
            // };
            // //生成detail
            // var member=spec.data.member;
            // var price=spec.data.price;
            // var spec=spec.data.spec;
            // var detail = member + ',' + spec;
            // wx.request({
            //   header: {
            //     "Content-Type": "application/x-www-form-urlencoded"
            //   },
            //   url: app.globalData.webSite + '/Home/Wechat/orderAdd',
            //   method: 'POST',
            //   data: {
            //     order_number: order_number,     //订单号
            //     hotel_id: res.data.hotel_id,    //酒店id
            //     hotel_name: res.data.hotel_name,//酒店名称
            //     hotel_phone: res.data.hotel_phone,   //酒店电话
            //     theme: res.data.theme,        //酒店房间类型
            //     address: res.data.address,      //酒店地址
            //     check_in: res.data.check_in,    //入住时间
            //     check_out: res.data.check_out,  //离宿时间
            //     detail: detail,                 //酒店详情
            //     cost_price: res.data.cost_price,//酒店原价格
            //     price: res.data.price,          //酒店实际价格
            //     used_score: res.data.used_score,//会员积分
            //     now_score: now_score,  //剩余积分
            //     status: 0,                      //状态
            //     user_name: res.data.user_name,  //入住人姓名
            //     user_phone: res.data.user_phone,//入住人电话  
            //   },
            //   success: function (res) {
            //     var code = res.data.code;
            //     if(code==200){
            //       app.globalData.userInfo.score = now_score;
            //        wx.switchTab({
            //         url: '/pages/me/index/index'
            //       });
            //       wx.request({
            //         header: {
            //           "Content-Type": "application/x-www-form-urlencoded"
            //         },
            //         url: app.globalData.webSite + '/Home/Admin/sendPhoneMessage',
            //         data: {
            //           send_model: 'order_remind',
            //         },
            //         method: 'POST',
            //         success: function (res){
            //         }
            //       });
            //     }
            //   }
            // })
          }
        });
      }
    });
  },

  clickChecked:function(){
    var that=this;
    var checked;
    if(checked==false){
      that.setData({
        active:''
      });
    }else{
      that.setData({
        active: 'active'
      });
    }
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