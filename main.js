const {app,BrowserWindow} = require("electron")
const path = require("path")
const url = require("url")

const ipcMain = require("electron").ipcMain


let win

function createWindow(){
    win = new BrowserWindow({width: 800,height: 600,frame: false})
    win.loadURL(url.format({
        pathname: path.join(__dirname,'index.html'),
        protocol: 'file',
        slashed: true
    }))

    win.webContents.openDevTools()
    
    win.on('closed', () => {
        win = null
    })

    win.on("resize", () => {

    })

}

app.on("ready",createWindow)

app.on("window-all-closed", () => {
    app.quit()
})

//监听登录界面事件
ipcMain.on("login-message", (events,args) => {
    //关闭事件
    if(args == "login-close"){
        events.returnValue = "close now!"
        win.close()
    }
    else{
        var loginMessage = JSON.stringify(args)
         //TODO 发送登录信息到服务器进行验证
      }
})