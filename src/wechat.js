const { Wechaty } = require('wechaty');
const WechatDisplayer = require('./WechatDisplayer');

class Wechat {
    constructor(_vscode){
        this.vscode = _vscode;
        var scheme = 'wechatjs';
        this.customUri = this.vscode.Uri.parse(`${scheme}://authority/wechatjs`);
        this.displayer = new WechatDisplayer(this.vscode,this.customUri);
        this.registration = this.vscode.workspace
        .registerTextDocumentContentProvider(scheme, this.displayer);
        this.init();
    }

    init() {                      //初始化
        let vscode = this.vscode;

        this.chatList = this.displayer.chatList;
        this.friendList = [];
        //跟注册事件相配合的数组，事件的注册，也是需要释放的
        var disposable = [];
        //保存需要释放的资源
        this.disposable = vscode.Disposable.from(disposable);
    }

    start(){
        Wechaty.instance({profile:'wechat-on-vscode'}) // Global Instance
        .on('scan', (qrcode, status) => this.scan(qrcode,status))
        .on('login',            user => this.login(user))
        .on('message',       message => this.messageHandler(message))
        .start();
    }

    scan(qrcode, status){
        console.log(`Scan QR Code to login: ${status}\nhttps://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrcode)}`)
        this.displayer.log('Please scan the QRcode to log in.');
        this.displayer.showImg(`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrcode)}`);
    }

    async login(user){
        this.currentUser = user;
        this.toUser = null;
        // this.displayer.setToUser(this.toUser);
        this.displayer.clean(false);
        this.displayer.log(`User ${user.name()} logined`);

        // Cache all the contact
        const contactList = await Wechaty.instance().Contact.findAll()   
        this.friendList = contactList.filter(contact => !!contact.friend())
        console.log('contact List ================== ');
        console.log(JSON.stringify(this.friendList));
        console.log(this.friendList);
    }

    chatTo ( payload ){
        const id = payload.id;
        const toUser = this.chatList[id]?this.chatList[id].contact:this.friendList.find(e => e.payload.id === id);
        if (toUser){
            this.toUser = toUser;
            console.log(this.toUser);
            this.displayer.setToUser(this.toUser);
        }
    }

    send ( payload ){
        if (payload.text.indexOf(':') === 0){
            // command mode
            const data = payload.text.split(' ');
            this.command(data[0].substring(1),data);
            return;
        }
        this.toUser.say(payload.text);
        if (!this.chatList[this.toUser.id]){
            this.chatList[this.toUser.id] = {
                contact:this.toUser,
                history: [],
            }
        }

        this.chatList[this.toUser.id].history.push({
            to: this.toUser,
            from: this.currentUser,
            timestamp: Math.round(new Date().getTime()/1000),
            text: payload.text,
        });
    }

    command(cmd,data) {
        console.log('command hererererererere')
        console.log(cmd);
        
        this[`${cmd}Cmd`](data[1]);
    }

    async filterCmd(data){
        console.log('call successssss data:' + data);
        // const contact = await Wechaty.instance().Contact.find({name: data});
        const contact = this.friendList.filter(e => e.name().indexOf(data) > -1);
        console.log(JSON.stringify(contact));
    }

    async chattoCmd(data){
        console.log('call successssss data:' + data);
        // const contact = await Wechaty.instance().Contact.find({name: data});
        const contact = this.friendList.filter(e => e.name().indexOf(data) > -1);
        console.log(JSON.stringify(contact));
        if (contact.length > 0){
            this.chatTo({id: contact[0].payload.id});
        }
    }


    // 緩存input內容和光標位置
    store( payload ){
        this.displayer.commandCache = payload.text;
    }

    messageHandler(message){
        console.log(message);
        const room = message.room()
        // 暂时过滤群
        if (room)return;
        // 查看是否正在聊天
        this.toUser = message.from().id === this.currentUser.id?message.to():message.from();
        if (!this.chatList[this.toUser.id]){
            this.chatList[this.toUser.id] = {
                contact:this.toUser,
                history: [],
            }
        }

        this.chatList[this.toUser.id].history.push({
            to: message.to(),
            from: message.from(),
            timestamp: message.payload.timestamp,
            text: message.text(),
        });

        // this.displayer.setToUser(this.toUser);

        if (message.from().id !== this.currentUser.id){
            // 自动回复
            // message.say('hi');
        }

        this.displayer.chat({
            content: `${message.text()}`,
            from: message.from(),
            to: message.to() || message.room(),
        });
    }

    dispose() {  //实现dispose方法
        this.disposable.dispose();
    }
}

module.exports = Wechat;