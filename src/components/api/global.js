export default {
    ws: {},
    setWs: function(newWs) {
        this.ws = newWs
    },
    saveSqllite: function(data){
        var that = this;
        return that.savemessage(data)
    },
    selectmessage:function () {
        var that = this;

            return that.selectSQL("SELECT * FROM messagegroup AS g LEFT JOIN messages AS m ON g.message_id = m.id order by g.send_time asc")
    },
    isopen:0,
    openDB:function() {
        var that = this;
        plus.sqlite.openDatabase({
               name: 'first',
               path: '_doc/test.db',
               success: function (data) {
                   console.log('数据类创建成功' + JSON.stringify(data))
                   //uid发送者ID origin_id 来源id(好友ID或房间ID)usernick发送者的昵称 roomnick  群昵称 useravatar 发送者的图像 roomavatar群图像 msgtext 消息 type(1好友消息 2.群消息) send_time 发送时间
                   that.executeSQL("CREATE TABLE IF NOT EXISTS messages(id integer primary key  autoincrement,uid INTEGER null,origin_id char null,usernick char null,roomnick char null,useravatar char null,roomavatar char null,msgtext text null,type INTEGER null,send_time INTEGER null,status INTEGER null)");
                   //id主键 origin_id 来源ID(好友ID或房间ID),message_id 消息ID,type 分组类型(1好友 2房间) send_time(最后一条消息的时间) 
                   that.executeSQL("CREATE TABLE IF NOT EXISTS messagegroup(id integer primary key  autoincrement,origin_id char null UNIQUE,message_id INTEGER null,type INTEGER null,send_time INTEGER null,count INTEGER null)");
               },
               fail: function (e) {
                   console.log('数据类【first】创建失败' + JSON.stringify(e));
               }
           });
       },
       executeSQL:  function (sql) {
        return new Promise((open) => {
            plus.sqlite.executeSql({
                name: 'first',
                sql: sql,
                success: function (data) {
                    console.log('数据表处理成功');
                    open(1)
                },
                fail: function (e) {
                    console.log('数据表处理失败' + JSON.stringify(e));
                    open(0)
                }
            });
        })
    },
    selectSQL:function (sql) {
        return new Promise((open) => {
            plus.sqlite.selectSql({
                name: 'first',
                sql: sql,
                success: function (data) {
                    console.log('数据表读取成功');
                    open(data)
                },
                fail: function (e) {
                    console.log('数据表读取失败' + JSON.stringify(e));
                }
            });
        })
    },
    savemessage:function (arr) {
    //     //循环写入数据库
    var that = this;
        return new Promise((open) => {
            var a = 0;
            for (var i = 0; i < arr.length; i++) {
                var str = "";
                for (var s in arr[i]) {
                    str += "'" + arr[i][s] + "',";
                }
                str = str.substr(0, str.length - 1);
                that.executeSQL("INSERT INTO messages VALUES(null," + str + ")").then(function (add_data) {
                });
                that.selectSQL("select last_insert_rowid() as id from messages limit 1").then(function (query_data) {
                    console.log('自增ID是:' + JSON.stringify(query_data))
                    if (query_data[0]) {
                        that.groupAdd(query_data[0].id).then(function (data) {
                            a++;
                
                            if (i == a) {
                                open(1)
                            }
                        })
                    } else {
                        console.log('未读取到自增ID')
                    }

                });
            }

        })
    },
    emptyout:function(){
           var that =this
      	    that.executeSQL("delete from messages");
			that.executeSQL("delete from messagegroup");
			that.executeSQL("delete from isfriend");
			that.executeSQL("delete from isroomgroup");
    },
		
	
    groupAdd:function (data) {
        var that = this;
        return new Promise((open) => {
            that.selectSQL("select * from messages where id = " + data).then(function (query) {
                if (query.length >= 1) {
                    that.selectSQL("select *,count(status = CASE  WHEN status = 1 THEN status=1 ELSE null END) as count,max(id) as ids from messages where origin_id = '" + query[0].origin_id + "' and type = " + query[0].type).then(function (query) {
                        return query;
                    }).then(function (data) {
                        that.selectSQL("select * from messagegroup where origin_id = '" + data[0].origin_id + "' and type = " + data[0].type).then(function (querys) {
                            var count = querys.length;
                            if (count >= 1) {
                                //有此聊天好友或群时
                                that.executeSQL("update messagegroup set send_time = " + data[0].send_time + ",message_id = " + data[0].id + ",count = " + data[0].count + " where origin_id ='" + data[0].origin_id + "' and type = " + data[0].type).then(function (data) {
                                    open(1)
                                })
                            } else {
                                //无此聊天好友或群时
                                that.executeSQL("INSERT INTO messagegroup VALUES(null,'" + data[0].origin_id + "'," + data[0].id + "," + data[0].type + "," + data[0].send_time + "," + data[0].count + ")").then(function (data) {
                                    open(1)
                                })

                            }
                        })
 
                    })
                }
            })
        })
    },
    withdrawone:function (id) {
        var that = this;
        var minute = new Date(new Date().getTime() - 1 * 60 * 1000);//前一分钟
        var time1 = (Date.parse(minute)) / 1000;//前一分钟时间戳	 	
        // var timestamp =(Date.parse(new Date()))/1000//获取当前时间戳;
        return that.executeSQL("DELETE FROM messages where id=" + id + " and send_time-" + time1 + "<0")
    },
    cleanscreen:function (origin_id) {
        var that = this;
        return that.executeSQL("DELETE FROM messagegroup where  origin_id='" + origin_id + "'")
    },
    removemsg: function (origin_id) {
        var that = this;
        return that.executeSQL("DELETE FROM messages where  origin_id='" + origin_id + "'")
    },
    status: function (origin_id) {
        var that = this;
        that.executeSQL("update messagegroup set count = 0 where origin_id ='" + origin_id + "'")
        return that.executeSQL("update messages set status = 2 where origin_id ='" + origin_id + "'")
    },
    originList: function (type, origin_id, currentpage) {
        var that = this;
        return that.selectSQL("SELECT * FROM messages where origin_id='" + origin_id + "' and type=" + type + " order by id desc Limit " + 30 * (currentpage - 1) + "," + 30 * currentpage)
    },
    updatelist:function (origin_id, qname) {
        var that = this;
        return that.executeSQL("update messages set roomnick = '" + qname + "'" + " where origin_id ='" + origin_id + "'")
    },

 }