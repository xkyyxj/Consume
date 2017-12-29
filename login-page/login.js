const ipcRenderer = require("electron").ipcRenderer

function loginPageReady(){
    var closeButton = document.getElementById("close-button")
    closeButton.addEventListener("click",closeLogin)

    var loginButton = document.getElementById("login-button")
    loginButton.addEventListener("click",login)

    var minimizeButton = document.getElementById("minimize-button")
    minimizeButton.addEventListener("click",minimizeLogin)

    var signupButton = document.getElementById('signup-button')
    signupButton.addEventListener('click',signup)
}

//用户点击登录按钮事件
function login(){
    //获取登录信息
    var loginName = document.getElementById("login-name").value
    var loginPassword = document.getElementById("login-password").value
    var loginInfo = {
        "name": loginName,
        "password": loginPassword,
        "type": "login"
    }


    //TODO 更改界面状态，显示登录中

    //获取登录是否成功的信息
    var loginResult = ipcRenderer.sendSync("login-message",loginInfo)
}

//用户点击注册按钮事件
function signup() {
    //好像不能用$('#signup-name').value，这样不能取到值
    var signupName = $('#signup-name').val()
    var signupPassword = $('#signup-password').val()
    var signupInfo = {
        "name" : signupName,
        "password" : signupPassword,
        "type": "signup"
    }

    var signupResult = ipcRenderer.sendSync("login-message",signupInfo)
}

//登录界面最小化事件
function minimizeLogin() {
    ipcRenderer.sendSync("login-message","minimize")
}

//登录界面关闭事件
function closeLogin(){
    ipcRenderer.sendSync("login-message","login-close")
}

//界面加载完成
window.onload=loginPageReady;