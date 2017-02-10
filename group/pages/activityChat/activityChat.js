var app = getApp();
var util = require('../../util/util.js')
// const sendMsg
let msg = [],
    msgUrl = [];

let activityChat = {
    data: {
       recording: false,
       playing: false,
       hasRecord: false,
       recordTime: 0,
       playTime: 0,
       formatedRecordTime: 0,
       formatedPlayTime: 0,
       isVoice: false,
       voiceTips: "文字",
       isSelected: true,
       isFocus: false,
       timeModal: true,
       voiceWidth: 0,
       progress: 0,
       isSend: false,
       nickName: '',
       avatarUrl: '',
       userId: '',
       activityId: '',
       iptVal: '',
       page: 2,
       isPull: false,
        //发送的消息，将自己发送的和别人发送的整到一起，区分开，
       sendMsg: [], 
       msgPic: '',
       isdisabled: false,
       placeholder: '',
       isShowForbiden: true,
       imgSrc: '',
       scaleImgModal: true,
       scrollTop: 100,
    },
    // 打开和发送消息
    sendSocket (data) {
        console.log('data',data);
       wx.onSocketOpen(function() {
            console.log('open')
            // 发送
            wx.sendSocketMessage({
                data: JSON.stringify(data),
            });
        });        
    },
    getUerInfo (activityId) {
        var that = this;
         // 链接
        wx.connectSocket({
            url: `${app.globalData.wsURL}`,
            success () {
                console.log('connect');
            }
        });
        wx.onSocketError(function() {
          console.log('error')
        });
        wx.onSocketClose(function(res) {
            console.log('WebSocket 已关闭！');
            wx.onSocketOpen(() => {
                console.log('WebSocket 已打开');
            });
            wx.showModal({
                title: '提示',
                content: 'websocket已关闭',
                success: function(res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    }
                }
            })
        })
        // enter room 
        app.getUserInfo((userInfo, userId) => { 
            this.setData({
                userId,
                avatarUrl: userInfo.avatarUrl,
                nickName: userInfo.nickName,
            });
            if (userId.length != 0) { 
                let options = {
                    eventType: 'enter room',
                    params: {
                        userId,
                        activityId,
                    }
                };
                that.sendSocket(options);
            }
        });
    },
    // 进入房间的状态
    socketEnterRoom (res) {
        let that = this;
        console.log('enter',res);
        if (res.result.code == 200) {
            let data = res.result.data;
            that.setData({
                isShowForbiden: data.activity.creator !== that.data.userId,
                isdisabled: data.activity.chatRoomStatus == 'open' ? false : true,
            });
            if (data.activity.status == 'close') {
                that.setData({
                    isDisabled: data.activity.creator !== that.data.userId,
                    placeholder: '禁言',
                });
            };
            let oldMsg = {
                eventType: 'old messages',
                params: {
                    page: 1,
                    pageSize: 10,
                },
            }
            wx.sendSocketMessage({
                data: JSON.stringify(oldMsg),
            });
        }
    },
    // 上拉触发old messages事件
    socketOldMsg (res) {
        let that = this;
        if (res.result.code == 200) {
            let datas = res.result.data;
            if (datas.length < 10) {
                that.setData({
                    isPull: true, 
                });
            } 
            datas.map((item,index) => {
                let userId = item.userInfo.userId,
                    username = item.userInfo.nickName,
                    avatarUrl = item.userInfo.avatarUrl,
                    type = item.type,
                    createTime = item.createTime,
                    message = type == 'text' ? item.message : item.url,
                    recordTime = type == 'text' ? 0 : item.recordTime;
                if (type == 'image') {
                    msgUrl.unshift(item.url);
                }
                msg.unshift({
                    userId,
                    username,
                    message,
                    avatarUrl,
                    type,
                    recordTime,
                    createTime,
                    isSelf: userId == that.data.userId,
                    isColor: '',
                    isPlay: 'play',
                })
            });
            that.setData({
                sendMsg: msg,
            });
        }
    },
    // 日期转换
    changeDate (date) {
        date = new Date(date);
        let hours = date.getHours(),
            minutes = date.getMinutes();

        return `${hours}:${minutes}`;
    },
    // newMessage分为两种情况
    socketNewMsg (res) {
        let that = this,
            infoTime;
        if (msg[msg.length-1] && msg[msg.length-1].createTime) {
            infoTime = msg[msg.length-1].createTime;
        }

        if (res.result.code == 200) {
            let data = res.result.data,
                userId = data.userId,
                username = data.username,
                avatarUrl = data.avatarUrl,
                createTime = data.createTime,
                type = data.type,
                message = type == 'text' ? data.message : data.url,
                recordTime = type == 'text' ? 0 : data.recordTime;
            if (type == 'image') {
                msgUrl.push(data.url);
            }
            let changeTimes = that.changeDate(createTime);
            
            let options = {
                userId,
                username,
                message,
                avatarUrl,
                type,
                recordTime,
                createTime,
                isSelf: userId == that.data.userId,
                isColor: '',
                isPlay: 'play',
            }
            if (infoTime) {
                infoTime = that.changeDate(infoTime);
                if (Number(changeTimes.substr(3))-Number(infoTime.substr(3)) >= 10) {
                    options['changeTimes'] = changeTimes;
                };
            }
        
            msg.push(options);
            that.setData({
                sendMsg: msg,
            });
        }
    },
    socketForbiden (res) {
        // console.log(res);
    },
    // 触发后台发起的socket事件
    socketEmit () {
        var that = this;
        wx.onSocketMessage(function (res) {
            res = JSON.parse(res.data);
            if (res.eventType == 'enter room') {
                that.socketEnterRoom(res);
            } else if (res.eventType == 'new message') {
                that.socketNewMsg(res);
            } else if (res.eventType == 'old messages') {
                that.socketOldMsg(res);
            } else if (res.eventType == 'forbit chat') {
                that.socketForbiden(res);
            }
        })
    },
    onLoad (options) {
        let activityId = options.activityId,
            that = this;
        this.setData({
            activityId,
            scrollTop: this.data.scrollTop + 1000,
        })
        msg = [];
        this.getUerInfo(activityId);
        this.socketEmit();
    },
    onShow () {
    },
    onUnload () {
        wx.closeSocket();
    },
    // 声音按钮
    handleVoice () {
        this.setData({
            isVoice: !this.data.isVoice,
            isSelected: true,
        });
        if (this.data.isVoice) {
            this.setData({
                voiceTips: "语音",
            })
        } else {
            this.setData({
                voiceTips: "文字",
            })
        }
    },
    // 添加按钮
    handleEvent () {
        this.setData({
            isSelected: !this.data.isSelected,
            isVoice: false,
            voiceTips: "文字",
        });
        if (!this.data.isSelected) {
            this.setData({
                isFocus: false,
            })
        } else {
            this.setData({
                isFocus: true,
            })
        }
    },
    // 录音
    handleRecord () {
        let that = this;
        let eachSecond = 60/60; //60s  百分之60的宽度

        this.setData({
            timeModal: false,
            recordTime: 0,
            formatedRecordTime: 0,
        })
        let interval = setInterval(function () {
            that.data.recordTime += 1
            that.setData({
                formatedRecordTime: that.data.recordTime
                // formatedRecordTime: util.formatTime(that.data.recordTime)
            })
        }, 1000)
        wx.startRecord({
            success: function (res) {
                that.setData({
                    tempFilePath: res.tempFilePath,
                    formatedPlayTime: that.data.recordTime,
                    voiceWidth: that.data.recordTime * eachSecond + 20,
                    // formatedPlayTime: util.formatTime(that.data.playTime)
                });
                console.log('record', res.tempFilePath)
                wx.uploadFile({
                    url: app.globalData.UPLOADURL, 
                    filePath: res.tempFilePath,
                    name: 'record',
                    success: function(res){
                        var data = JSON.parse(res.data);
                        console.log('uoload',data);
                        if (data.code == 200) {
                            let options = {
                                eventType: 'new message',
                                params: {
                                    type: 'record',
                                    url: data.data.url,
                                    recordTime: that.data.recordTime,
                                }
                            }
                            wx.sendSocketMessage({
                                data: JSON.stringify(options),
                            });
                        }
                    }
                })
            },
            fail (res) {
                //录音失败
            },
            complete: function () {
                clearInterval(interval)
            }
        });
    },
    // 停止录音
    handleEndRecord () {
        wx.stopRecord();
        this.setData({
            timeModal: true,
        })
    },
    // 播放录音
    startPlay (e) {
        let that = this,
            voiceUrl = e.currentTarget.dataset.url,
            formatedPlayTime = e.currentTarget.dataset.recordTime,
            eachProgress = Math.ceil(100/formatedPlayTime),
            progress = 0,
            isReturn = false;
        
        let playTimeInterval = setInterval(function () {
            progress +=1;
            that.data.formatedPlayTime -= 1
            that.setData({
                  playing: true,
                  formatedPlayTime: that.data.formatedPlayTime,
                  progress: progress * eachProgress,
                //   formatedPlayTime: util.formatTime(that.data.playTime)
            })
          }, 1000);

        wx.downloadFile({
            url: voiceUrl, //仅为示例，并非真实的资源
            success: function(res) {
                wx.playVoice({
                    filePath: res.tempFilePath,
                    complete () {
                        console.log(3);
                        msg.some((item, index) => {
                            if (item.message == voiceUrl) {
                                item.isColor='';
                                item.isPlay = "play";
                            }
                        })
                        that.setData({
                            sendMsg: msg,
                        });
                    },
                });
            },
            fail: function (res) {
                console.log('fail'+JSON.stringify(res))
                isReturn = true;
            }
        });
        if (isReturn) {
            return;
        };
        msg.some((item, index) => {
            if (item.message == voiceUrl) {
                item.isColor='#10aeff';
                item.isPlay = "playing";
            }
        })
        that.setData({
            sendMsg: msg,
        });
    },
    // 输入框
     bindKeyInput (e) {
        let iptVal = e.detail.value;
        if (iptVal.length !== 0) {
            this.setData({
                isSend: true,
                iptVal,
            })
        } else {
            this.setData({
                isSend: false,
            })
        }
    },
    // 选择图片
    handlePic () {
        var that = this;
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths;
                that.setData({
                    msgPic: tempFilePaths[0],
                })
                console.log(tempFilePaths[0])
                wx.uploadFile({
                    url: app.globalData.UPLOADURL, 
                    filePath: tempFilePaths[0],
                    name: 'image',
                    success: function(res){
                        var data = JSON.parse(res.data);
                        if (data.code == 200) {
                            let options = {
                                eventType: 'new message',
                                params: {
                                    type: 'image',
                                    url: data.data.url,
                                }
                            }
                            wx.sendSocketMessage({
                                data: JSON.stringify(options),
                            });
                            that.setData({
                                isSelected: !that.data.isSelected,
                                isVoice: false,
                                voiceTips: "文字",
                            });
                            if (!that.data.isSelected) {
                                that.setData({
                                    isFocus: false,
                                })
                            } else {
                                that.setData({
                                    isFocus: true,
                                })
                            }
                        }
                    }
                });

                
            }
        })
    },
    // 发送
    handleSend () {
        let iptVal = this.data.iptVal,
            sendMsg = this.data.sendMsg,
            that = this;

        let options = {
            eventType: 'new message',
            params: {
                message: iptVal,
            }
        }
        wx.sendSocketMessage({
            data: JSON.stringify(options),
        });
        this.setData({
            isSend: false,
            iptVal: '',
            scrollTop: this.data.scrollTop+3000000,
            toView: 'scroll_bottom',
        });

        if (!this.data.isSelected) {
            this.setData({
                isSelected: true,
            })
        }
    },
    // 下拉加载就消息
    bindscrolltoupper () {
        if (this.data.isPull) {
            return;
        }
        let page = this.data.page;
        this.setData({
            page: page+1,
        })
        let options = {
            eventType: 'old messages',
            params: {
                page,
                pageSize: 10,
            },
        }
        wx.sendSocketMessage({
            data: JSON.stringify(options),
        });
    },
    // 是否禁言
    switchChange (e) {
        let isdisabled = e.detail.value,
            valid;
        if (isdisabled) {
            valid = 'closed';
        } else {
            valid = 'open';
        }
        let options = {
            eventType: 'forbit chat',
            params: {
                state: valid,
            }
        };
        wx.sendSocketMessage({
            data: JSON.stringify(options),
        });  
    },
    // 放大图片
    handleScalePic (e) {
        let imgSrc = e.currentTarget.dataset.src;
        // this.setData({
        //     imgSrc,
        //     scaleImgModal: false,
        // })

        wx.previewImage({
            current: imgSrc, // 当前显示图片的http链接
            urls: msgUrl // 需要预览的图片http链接列表
        })
    },
    // 隐藏放大的图片
    handleImgHidden () {
        this.setData({
            scaleImgModal: true,
        })
    },
};

Page(activityChat);
