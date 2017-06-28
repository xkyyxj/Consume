function contentPageReady(){
    var closeButton = document.getElementById("close-button")
    closeButton.addEventListener("click",closeLogin)

    var minimizeButton = document.getElementById("minimize-button")
    minimizeButton.addEventListener("click",minimizeLogin)
}

//登录界面最小化事件
function minimizeLogin() {
    ipcRenderer.sendSync("main-message","minimize")
}

//登录界面关闭事件
function closeLogin(){
    ipcRenderer.sendSync("main-message","close")
}

//获取用户类别数据
function requireTypeInfo() {

}

//获取类别下的详细数据
function requireDetailInfo() {
    
}

//界面加载完成
window.onload=contentPageReady;