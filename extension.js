const vscode = require('vscode');

function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "wechat-on-vscode" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    const Wechat = require('./src/wechat');
    const wechat = new Wechat(vscode);

        // set up new custom provider
    
    let startDis = vscode.commands.registerCommand('extension.start', function () {

        wechat.start();
        vscode.window.onDidChangeActiveTextEditor(() => {
            console.log('change active');
        })
        return vscode.commands.executeCommand('vscode.previewHtml', vscode.Uri.parse(wechat.customUri), vscode.ViewColumn.Two, 'Wechat on Vscode').then((success) => {
		}, (reason) => {
			vscode.window.showErrorMessage(reason);
        });
        
        // wechat.displayer.update(customUri, '<img src="https://blog.mikehodnick.com/content/images/2017/02/content-provider-animation.gif"/>');
    });

    context.subscriptions.push(startDis,wechat.registration);

    let openDis = vscode.commands.registerCommand('extension.open', function () {
        vscode.window
        .showInformationMessage('hello', 'test', 'taco', 'cheeseburger')
        .then(selection => {
            console.log(selection);
        });

    });

    context.subscriptions.push(openDis,wechat.registration);

    let sendDis = vscode.commands.registerCommand('extension.send', function (ele) {
        wechat.store({text:''});
        wechat.send(ele);
        // vscode.window.showInformationMessage('發送成功');
    });

    context.subscriptions.push(sendDis,wechat.registration);

    let storeDis = vscode.commands.registerCommand('extension.store', function (ele) {
        wechat.store(ele);
        // vscode.window.showInformationMessage('發送成功');
    });

    context.subscriptions.push(storeDis,wechat.registration);

    let chatDis = vscode.commands.registerCommand('extension.chatto', function (ele) {
        wechat.chatTo(ele);
        // vscode.window.showInformationMessage('發送成功');
    });

    context.subscriptions.push(chatDis,wechat.registration);


}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;