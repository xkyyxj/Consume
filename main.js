const {app,BrowserWindow} = require("electron")
const path = require("path")
const url = require("url")
const http = require('http')

const ipcMain = require("electron").ipcMain

let win

let userId

function createWindow(){
    win = new BrowserWindow({width: 800,height: 600,frame: false,resizable: false})
    win.loadURL(url.format({
        pathname: path.join(__dirname,'login-page/index.html'),
        protocol: 'file',
        slashed: true
    }))

    win.webContents.openDevTools()
    
    win.on('closed', () => {
        win = null
    })

}

app.on("ready",createWindow)

app.on("window-all-closed", () => {
    //app.quit()
})

//监听登录界面事件
ipcMain.on("login-message", (events,args) => {
    //关闭事件
    if(args == "login-close"){
        events.returnValue = "close now!"
        win.close()
        app.quit()
    }
    //最小化事件
    else if(args == "minimize"){
        //貌似ipcRenderer必须需要一个返回值，在使用sendSync的情况下
        events.returnValue = "finish minimize"
        win.minimize()
    }
    //登录或者注册事件
    else{
        //根据message当中的type字段判定是登录还是注册
        var sendMessage = {
            "name": args.name,
            "password": args.password
        }
        var data = JSON.stringify(sendMessage)
        var type = args.type
        var serverReturnMessage = null
        if(type == "login"){
            //发送登录信息到服务器进行验证
            const options = {
		        hostname: 'localhost',
		        port: 8080,
		        path: '/login',
		        method: 'POST',
		        headers: {
                    'Content-Type' : 'application/json',
                    'Content-Length': Buffer.byteLength(data)
		        }
            }
            //创建HTTP请求
	        var req = http.request(options,(resp) => {
		        resp.setEncoding("utf-8")
		        resp.on("data", (chunk) => {
                    //处理返回信息
                    serverReturnMessage = JSON.parse(chunk)
                    events.returnValue = chunk

                    if(serverReturnMessage.returnCode == 0){
                        win.close()
                        createMainWindow()
						userId = serverReturnMessage.userId
                    }
                    else{
                        //TODO - 提示信息，用户名或者密码错误
                    }
		        })
	        })

            req.end(data)
        }
        else{
            //发送注册信息到服务器
            const options = {
		        hostname: 'localhost',
		        port: 8080,
		        path: '/signup',
		        method: 'POST',
		        headers: {
                    'Content-Type' : 'application/json',
                    'Content-Length': Buffer.byteLength(data)
		        }
            }
    
            //创建HTTP请求
	        var req = http.request(options,(resp) => {
		        resp.setEncoding("utf-8")
		        resp.on("data", (chunk) => {
                    //TODO - 处理返回信息
                    serverReturnMessage = chunk
                    events.returnValue = chunk
		        })
	        })

            req.end(data)
        }

    }
})

//监听主界面事件
ipcMain.on("main-message", (events,args) => {
//关闭事件
    if(args == "close"){
        events.returnValue = "close now!"
        win.close()
        app.quit()
    }
    else if(args == "minimize"){
        //貌似ipcRenderer必须需要一个返回值，在使用sendSync的情况下
        events.returnValue = "finish minimize"
        win.minimize()
    }
	else {
		//向数据库当中插入类别数据的请求
		if(args.type == "inserttype") {
			var sendMessage = {
				"name" : args.name,
				"user_id" : userId
			}
			
			var data = JSON.stringify(sendMessage)
			//发送注册信息到服务器
            const options = {
		        hostname: 'localhost',
		        port: 8080,
		        path: '/insertconsumetypeinfo',
		        method: 'POST',
		        headers: {
                    'Content-Type' : 'application/json',
                    'Content-Length': Buffer.byteLength(data)
		        }
            }
    
            //创建HTTP请求
	        var req = http.request(options,(resp) => {
		        resp.setEncoding("utf-8")
		        resp.on("data", (chunk) => {
                    //TODO - 处理返回信息
                    serverReturnMessage = chunk
                    events.returnValue = chunk
		        })
	        })

            req.end(data)
		}
		//向数据库当中插入消费详细条目的请求
		else if(args.type == "insertcontent") {
			delete args.type
			
			var data = JSON.stringify(args)
			
			//发送请求数据信息到服务器
            const options = {
		        hostname: 'localhost',
		        port: 8080,
		        path: '/insertconsumeinfo',
		        method: 'POST',
		        headers: {
                    'Content-Type' : 'application/json',
                    'Content-Length': Buffer.byteLength(data)
		        }
            }
    
            //创建HTTP请求
	        var req = http.request(options,(resp) => {
		        resp.setEncoding("utf-8")
		        resp.on("data", (chunk) => {
                    //TODO - 处理返回信息
                    serverReturnMessage = chunk
                    events.returnValue = chunk
		        })
	        })

            req.end(data)
		}
		//向服务端请求该用户的消费数据
		else if(args.type == "requireTypeContent") {
			var sendMessage = {
				"userId": userId
			}
			
			var data = JSON.stringify(sendMessage)
			
			//发送请求数据信息到服务器
            const options = {
		        hostname: 'localhost',
		        port: 8080,
		        path: '/requireTypeInfo',
		        method: 'POST',
		        headers: {
                    'Content-Type' : 'application/json',
                    'Content-Length': Buffer.byteLength(data)
		        }
            }
    
            //创建HTTP请求
	        var req = http.request(options,(resp) => {
		        resp.setEncoding("utf-8")
		        resp.on("data", (chunk) => {
                    //TODO - 处理返回信息
                    serverReturnMessage = chunk
                    events.returnValue = chunk
		        })
	        })

            req.end(data)
		}
	}
})

function createMainWindow() {
    win = new BrowserWindow({minWidth: 800,minHeight: 600,frame: false})
    win.loadURL(url.format({
        pathname: path.join(__dirname,'main.html'),
        protocol: 'file',
        slashed: true
    }))

    win.webContents.openDevTools()

    win.on('closed', () => {
        win = null
    })
}

//发送请求到服务器
function httpRequest(data) {
    

}