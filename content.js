const Buffer = require("buffer").Buffer
const fs = require("fs")
const ipcRenderer = require("electron").ipcRenderer
const path = require('path')
const readline = require('readline')

let selectedTypeId

let inputTemplate

var typeItemTabIndex = 1

function contentPageReady(){
    /*var closeButton = document.getElementById("close-button")
    closeButton.addEventListener("click",closeLogin)

    var minimizeButton = document.getElementById("minimize-button")
    minimizeButton.addEventListener("click",minimizeLogin)*/
    //使用jQuery重写上述代码

    //按钮监听事件
    $('#add-type-button').bind('click', addTypeItem)
    $('#delete-type-button').bind('click', deleteTypeItem)

    $('#close-button').bind('click',closeMain)
    $('#minimize-button').bind('click',minimizeMain)
	
	$('#item-add-button').bind('click',addConsumeContent)

	$('#content-ok').bind('click',sendMessageToServer);

    //从文件加载用户的类别数据
    requireTypeInfo()
}

//登录界面最小化事件
function minimizeMain() {
    ipcRenderer.sendSync("main-message","minimize")
}

//登录界面关闭事件
function closeMain(){
    ipcRenderer.sendSync("main-message","close")
}

//获取用户类别数据
function requireTypeInfo() {
	//首先从服务器端获取数据
	var requireInfo = {
		"type": "requireTypeContent"
	}
	
	//发送信息到main.js，经由main.js获取数据
	var returnValue = ipcRenderer.sendSync("main-message", requireInfo)
	
	if(returnValue != null) {
		displayTypeInfo(JSON.parse(returnValue))
	}
	else {
		//其次是从本地文件系统当中获取数据
		var typeInfoFile = fs.createReadStream(path.join(__dirname, 'typeInfoFile'))
		var rl = readline.createInterface({
			input: typeInfoFile
		})

		rl.on('line', (line) => {
			constructSingleTypeItem(JSON.parse(line),false)
		})
	}
    
}

//将用户类别数据写入到文件当中
function writeTypeInfo(singleItemData) {
    var typeInfoFile = fs.createWriteStream(path.join(__dirname, 'typeInfoFile'))
    write(singleItemData)

    function write(singleItemData) {
        typeInfoFile.write(JSON.stringify(singleItemData),'UTF-8')
        typeInfoFile.end("\n", 'UTF-8')
    }
}

//展示用户类别数据到界面上
function displayTypeInfo(jsonObj) {
	for(var i = 0; i < jsonObj.length;i++){
		constructSingleTypeItem(jsonObj[i],false)
	}
}

//点击添加类别信息时的操作
function addTypeItem() {
    //添加输入框
    var typeInput = $('<input id = "type-input" type = "text" style="border: none;width: 100%;"/>')
    $('#id-type-display').append(typeInput)
    typeInput.focus()

    //获取输入内容
    var typeName = null
    typeInput.blur(() => {
        var typeString = $('#type-input')[0].value
        var singleItemData = {
            "name": typeString
        }
        typeInput.remove()
        //当用户确实是输入了类别信息的时候才建立类别项目
        if(typeString != null && typeString != "") {
            constructSingleTypeItem(singleItemData,true)
            writeTypeInfo(singleItemData)
        }
    })
}

//将用户添加的消费类别写入到数据库当中
function writeTypeIntoDB(singleItemData) {
	var sendMessage = {
		"name" : singleItemData.name,
		"type" : "inserttype"
	}
	
	var serverReturnInfo = ipcRenderer.sendSync("main-message",sendMessage)
	var returnInfoJSON = JSON.parse(serverReturnInfo)
	return returnInfoJSON
}

 
//点击删除类别信息时的操作
function deleteTypeItem() {
    var deleteItem = $('template-item:focus')
    deleteItem.remove()
}

//构建单条类别展示数据内容
function constructSingleTypeItem(singleItemData, isNewItem) {
    var typeName = singleItemData.name
    var newItem = $('#template-item').clone()
    //下面一行去除ID属性，以避免用户多次添加的时候复制以前添加的Item
    newItem[0].removeAttribute('id')
    newItem[0].innerHTML = typeName
    //不知为何，被注释掉的这行设置不起作用
    //newItem[0].tabindex = typeItemTabIndex
    newItem[0].setAttribute('tabindex', typeItemTabIndex++)
    $('#id-type-display').append(newItem)
	
	//如果是新增加的类型数据，向数据库当中插入类别信息
	if(isNewItem) {
		var returnInfoJSON = writeTypeIntoDB(singleItemData)
		//通过对标签新建属性的方式保存类别ID
		newItem.attr("typeid", returnInfoJSON.returnValue)
	}
	else {
		//通过对标签新建属性的方式保存类别ID
		newItem.attr("typeid", singleItemData.typeId)
	}
	

    //绑定获取详细数据的事件监听函数
    newItem.bind('click',requireDetailInfo)
}

//获取类别下的详细数据
function requireDetailInfo() {
	//选定的消费类别ID记录下来
	selectedTypeId = this.getAttribute("typeid")
	
	
}

//用户点击新增消费内容按钮的监听事件
function addConsumeContent(){
	inputTemplate = $("#list-item-input").clone()
	
	var parentContainer = $(".details-display-list")
	
	parentContainer.append(inputTemplate)
	inputTemplate.removeAttr("id")
	inputTemplate.removeAttr("style")
	//普通的div组件无法触发blur以及focus事件，此处添加tabindex解决此问题
	inputTemplate[0].setAttribute('tabindex', typeItemTabIndex++)
	inputTemplate.focus()
	
	//var inputMessage = new Object()
	
	//获取详细的输入信息
	/*inputTemplate.blur(() => {
		inputMessage.consume_num = $(".item-consume-num-input").val()
		inputMessage.consume_time = $(".item-consume-date-input").val()
		inputMessage.content = $(".item-consume-detail-input").val()
		inputMessage.consume_type_id = selectedTypeId
		
		//发送至主线程
		inputMessage.type="insertcontent"
		var serverReturnInfo = ipcRenderer.sendSync("main-message",inputMessage)
		
		if(serverReturnInfo.returnCode == 0){
			inputTemplate.remove()
			inputMessage.content_id = serverReturnInfo.returnValue
			displayConsumeInfo(inputMessage)
		}
	})*/
}

function displayConsumeInfo(consumeInfo){
	var consumeItem = $("#consume-item").clone()
	
	var parentContainer = $(".details-display-list")
	
	parentContainer.append(consumeItem)
	$(".item-consume-num").innerHTML = consumeInfo.consume_num
	$(".item-consume-date").innerHTML = consumeInfo.item-consume-date
	$(".item-consume-detail").innerHTML = consumeInfo.item-consume-detail
}

//将用户输入的消费信息发送到服务器上去
function sendMessageToServer() {
	var inputMessage = new Object()

	inputMessage.consume_num = $(".item-consume-num-input").val()
	inputMessage.consume_time = $(".item-consume-date-input").val()
	inputMessage.content = $(".item-consume-detail-input").val()
	inputMessage.consume_type_id = selectedTypeId

	//发送至主线程
	inputMessage.type="insertcontent"
	var serverReturnInfo = ipcRenderer.sendSync("main-message",inputMessage)
	
	if(serverReturnInfo.returnCode == 0){
		inputTemplate.remove()
		inputMessage.content_id = serverReturnInfo.returnValue
		displayConsumeInfo(inputMessage)
	}
	
}

//界面加载完成
window.onload=contentPageReady;