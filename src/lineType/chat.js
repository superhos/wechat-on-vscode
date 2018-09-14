class chat {
    render(e){
        // return `<span> <img style="width:20px;height:20px;border-radius:100px;" src="https://wx.qq.com${e.contact.payload.avatar}"/>【${e.date}】 ${e.content}</span></br>`;
        return `<span>${e.date}   <font style="color:#F2F2F2">INFO</font>   [ <a href="${encodeURI('command:extension.chatto?' + JSON.stringify({id: e.from.payload.id}))}">${e.from.name()}</a>   <font style="color:#F2F2F2">---&gt;</font>   <a href="${encodeURI('command:extension.chatto?' + JSON.stringify({id: e.to.payload.id}))}">${e.to.name()}</a> ]   ${e.content}</span></br>`;
    }
}

module.exports = chat;