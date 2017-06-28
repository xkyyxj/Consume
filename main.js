const {app,BrowserWindow} = require("electron")
const path = require("path")
const url = require("url")

const ipcMain = require("electron").ipcMain

let win

function createWindow(){
    win = new BrowserWindow({width: 800,height: 600,frame: false,resizable: false})
    win.loadURL(url.format({
        pathname: path.join(__dirname,'index.html'),
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
    else if(args == "minimize"){
        //貌似ipcRenderer必须需要一个返回值，在使用sendSync的情况下
        events.returnValue = "finish minimize"
        win.minimize()
    }
    else{
        var loginMessage = JSON.stringify(args)
         //TODO 发送登录信息到服务器进行验证

        //模拟登录成功
        var loginResult = {"result": true}
        events.returnValue = loginResult;

        if(loginResult.result){
            win.close()
            createMainWindow()
        }
        else{
            app.quit()
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