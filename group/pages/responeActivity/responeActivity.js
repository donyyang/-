var app = getApp();

var responseActive = {
    data: {
        activeName: '',
        activeDate: '',
        activePlace: '',
        activeInfo: '',
        activeNum: 0,
        joinpeopleData: [],
        creater: [],
        joinActivity: '参与活动',
        userId: '',
        activityId: '',
        isQuit: false,
        isShowJoin: true,
        amount: 0,
    },
    onShow () {
        wx.setNavigationBarTitle({
        title: '活动详情',
        })
    },
    onLoad (options) {
        let activityId = options.activityId;
        this.setData({
            activityId,
        })
        app.getUserInfo((userInfo, userId) => {
            this.setData({
                userId,
            })
        });
        // try {
        //     var userId = wx.getStorageSync('userId')
        //     if (userId) {
        //         this.setData({
        //         userId,
        //         });
        //     }
        // } catch (e) {
        // // Do something when catch error
        // }
        this.requestInfo(activityId);
    },
    // 活动详情
    requestInfo (activityId) {
        let userId = this.data.userId;
        app.fetchApi(`${app.globalData.URL}activity/detail`,'GET',{
            activityId,
            userId,
        }, (res) => {
            if (res.code == 200) {
                var data = res.data;
                this.setData({
                    creater: data.creator,
                    amount: data.amount,
                })
                if (userId == data.creator.userId) {
                    this.setData({
                        isShowJoin: false,
                    })
                } else {
                    this.setData({
                        isShowJoin: true,
                    })
                    if (data.hasAttended) {
                        this.setData({
                            joinActivity: '退出活动',
                            isQuit: true,
                        })
                    }
                }
                this.setData({
                    activeName: data.title,
                    activeDate: data.beginTime,
                    activePlace: data.place,
                    joinpeopleData: data.attenders,
                    activeInfo: data.description,
                    activeNum: data.attenderNum,
                })
            }
        })
    },
    // 参与活动
    requestJoin () {
        let userId = this.data.userId,
            activityId = this.data.activityId;
        app.fetchApi(`${app.globalData.URL}activity/attend`,'GET',{
            activityId,
            userId,
        }, (res) => {
            if (res.code == 200) {
                wx.showToast({
                    title: '参加成功',
                    icon: 'success',
                    duration: 1000
                });
                this.setData({
                    isQuit: true,
                    joinActivity: '退出活动',
                });
                // wx.redirectTo({
                //     url: '../index/index',
                //     success: function(res){
                //     },
                // })
                wx.navigateBack({
                  delta: 1, // 回退前 delta(默认为1) 页面
                })
            } else {
                 wx.showModal({
                    title: '提示',
                    content: res.message,
                    success: function(res) {
                    }
                })
            }
        })
    },
    // 退出活动
    requestQuit () {
        let activityId = this.data.activityId,
            userId = this.data.userId;

        app.fetchApi(`${app.globalData.URL}activity/quit`,'GET',{
            activityId,
            userId,
        }, (res) => {
            console.log();
            if (res.code == 200) {
                wx.showToast({
                    title: '退出成功',
                    icon: 'success',
                    duration: 1000
                })
                // wx.redirectTo({
                //     url: '../index/index',
                //     success: function(res){
                //     },
                // })
                wx.navigateBack({
                  delta: 1, // 回退前 delta(默认为1) 页面
                })
            } else {
                wx.showModal({
                    title: '提示',
                    content: '退出失败',
                    success: function(res) {
                    }
                })
            }
        })
    },
    handleJoin (e) {
        console.log(e);
        if (!this.data.isQuit) {
            this.requestJoin();
        } else {
            this.requestQuit();
        }
    },
    handlePlace () {
        wx.getLocation({
        type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        success (res) {
            let latitude = res.latitude
            let longitude = res.longitude
            wx.openLocation({
            latitude: latitude,
            longitude: longitude,
            scale: 28,
            success (res) {
                wx.chooseLocation({
                success (res) {
                    this.setData({
                        address: res.address,
                    })
                }
                })
            }
            })
        }
        })
    },
    handleDiscuss () {
        let activityId = this.data.activityId;
        wx.navigateTo({
            url: `../activityChat/activityChat?activityId=${activityId}`,
            success: function(res){
            },
        })
    },
    // 分享
    onShareAppMessage: function () {
        return {
        title: this.data.activeName,
        desc: '',
        path: `/pages/responeActivity/responeActivity?activityId=${activityId}`
        }
    },
    // // 提交参与活动
    // handleSubmit (e) {
    //     console.log(e)
    // },
    // 调用支付接口
    handleShare: function () {
        let activityId = this.data.activityId,
            userId = this.data.userId,
            amount = this.data.amount;
        console.log('amount',amount);
        // app.fetchApi(`${app.globalData.URL}activity/quit`,'GET',{
        //     activityId,
        //     userId,
        //     amount,
        // },(res) => {

        // })
    },

}
Page(responseActive);