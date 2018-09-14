const moment = require('moment');
const factory = require('./lineType/factory');
const View = require('./View');

class WechatDisplayer {
    constructor(_vscode,uri){
        this.vscode = _vscode;
        this.view = new View();
        this.uri = uri;
        this.chatList = {};
        this.init();
    }

    init() {
        //初始化
        let vscode = this.vscode;

        this.onDidChangeEvent = new vscode.EventEmitter();
        this.commandCache = '';
        // this.content = '';
        this.vContent = [{
            index: 0,
            type: 'log',
            date: moment().format('YYYY-MM-DD HH:mm:ss'),
            content: `Welcome to use the Wechat-on-VScode...`,
        }];
        //跟注册事件相配合的数组，事件的注册，也是需要释放的
        var disposable = [];
        //保存需要释放的资源
        this.disposable = vscode.Disposable.from(disposable);
    }

    setToUser (user){
        this.toUser = user;
        this.update();
    }

    render(){
        if (this.vContent.length === 0)return '';
        let result = [];
        this.vContent.forEach(e => {
            result.push(factory.getType(e.type).render(e));
        });

        return result.join('');
    }

    provideTextDocumentContent(uri) {

        let href = encodeURI('command:extension.open1111');
        const data = {
            line: this.render(),
            href,
            msg: this.commandCache,
            // chatList: JSON.stringify(this.chatList), // chatList.join(''),
            toUser: this.toUser?this.toUser.name():'non-target',
        }

        let body = this.view.render(data);

        return body;
    }

    get onDidChange() {
        return this.onDidChangeEvent.event;
    }

    showImg(url) {
        // this.update(`<img src='${url}' />`);
        this.vContent.push({
            index: this.vContent.length,
            type: 'img',
            date: moment().format('YYYY-MM-DD HH:mm:ss'),
            content: url,
        })
        this.update();
    }

    log(content){
        this.vContent.push({
            index: this.vContent.length,
            type: 'log',
            date: moment().format('YYYY-MM-DD HH:mm:ss'),
            content: content,
        })
        this.update();
    }

    chat(payload){
        this.vContent.push({
            index: this.vContent.length,
            type: 'chat',
            date: moment().format('YYYY-MM-DD HH:mm:ss'),
            content: payload.content,
            from: payload.from,
            to: payload.to,
        })

        this.update();
    }

    clean(update = true){
        this.vContent = [];
        if(update)this.update();
    }

    update() {
        // if (message) this.content += `${message} `;
        this.onDidChangeEvent.fire(this.uri);
    }

    dispose() {  //实现dispose方法
        this.disposable.dispose();
    }
}

module.exports = WechatDisplayer;