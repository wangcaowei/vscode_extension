import * as vscode from "vscode";
const axios = require("axios");
const { exec } = require('child_process');

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "helloworld.helloWorld",
    () => {
      // 插件内容
      const message = "My First Extension";
      vscode.window.showInformationMessage(message);
      // vscode.window.showWarningMessage('Hello VS Code!');

      // 插件自动更新
      // 获取当前插件的扩展对象
      const extension = vscode.extensions.getExtension("wxl.helloworld");
      var currentVersion = "0.0.0";
      var newVersion = "0.0.0";
      // 获取当前插件的版本号
      if (extension) {
        currentVersion = extension.packageJSON.version;
        fetchData();
      }

      // 比较两个版本号大小
      function compareVersions(currentVersion: string, newVersion: string) {
        const cur = currentVersion.split(".").map(Number);
        const newCur = newVersion.split(".").map(Number);

        for (let i = 0; i < 3; i++) {
          if (cur[i] < newCur[i]) {
            return true;
          }
        }
        return false;
      }

      // 获取最新版本号
      function fetchData() {
        const url = "http://localhost:3000/getVersion";
        axios
          .get(url)
          .then((response: { data: any }) => {
            // 处理响应数据
            newVersion = response.data.version;
            if (compareVersions(currentVersion, newVersion)) {
              // vscode.window.showInformationMessage(`当前版本号：${currentVersion}，最新版本号：${newVersion}`);
              vscode.window
                .showInformationMessage(
                  "hello world 有新的更新可用，点击安装最新版本",
                  "安装"
                )
                .then((selection) => {
                  if (selection === "安装") {
                    // 执行 CLI 命令来下载并安装自定义插件文件
                    const customExtensionUrl = 'https://example.com/custom-extension.vsix'; // 自定义插件文件的下载链接
                    const cliCommand = `code --install-extension ${customExtensionUrl}`;
                    
                    exec(cliCommand, (error: { message: any; }, stdout: any, stderr: any) => {
                        if (error) {
                            console.error(`执行命令出错: ${error.message}`);
                            return;
                        }
                        if (stderr) {
                            console.error(`命令执行过程中出现错误: ${stderr}`);
                            return;
                        }
                        console.log(`命令执行结果: ${stdout}`);
                        
                        vscode.window.showInformationMessage('插件已成功安装！');
                    });
                  }
                });
            }
          })
          .catch((error: any) => {
            // 处理错误
            console.error("请求错误:", error);
          });
      }
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
