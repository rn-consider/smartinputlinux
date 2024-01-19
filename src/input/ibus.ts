import { exec } from 'child_process';
import * as vscode from 'vscode';
const chineseCursorColor = '#00FF00'; // 设置中文光标颜色
const englishCursorColor = '#FFFFFF'; // 设置英文光标颜色
// 用于改变光标颜色
function setCursorColor(color: string) {
    vscode.workspace.getConfiguration().update('workbench.colorCustomizations', {
        'editorCursor.foreground': color
    }, vscode.ConfigurationTarget.Global);
};
export class Ibus {
    private chineseCursorColor: string;
    private englishCursorColor: string;
    constructor(chineseCursorColor: string, englishCursorColor: string) {
        this.chineseCursorColor = chineseCursorColor;
        this.englishCursorColor = englishCursorColor;
    }
    SetEnglishCursorColor(){
        setCursorColor(englishCursorColor);
    }
    ChangeInputToChinese(input: string): void {        try {
            setCursorColor(this.chineseCursorColor); // 将 setCursorColor 放入回调函数中
        } catch (error) {
            console.error(`设置光标颜色失败: ${error}`);
        }
        exec(`/usr/bin/ibus engine ${input}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`执行错误: ${error}`);
                vscode.window.showWarningMessage(`执行错误: ${error.message}`); // 显示警告消息
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
        });

    }
    
    ChangeInputToEnglish(input: string): void {        try {
            setCursorColor(this.englishCursorColor);
        } catch (error) {
            console.error(`设置光标颜色失败: ${error}`);
        }
        exec('/usr/bin/ibus engine xkb:us::eng', (error, stdout, stderr) => {
            if (error) {
                console.error(`执行错误: ${error}`);
                vscode.window.showWarningMessage(`执行错误: ${error.message}`); // 显示警告消息
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
        });

    }
    ObtainIM(): Promise<string> {
        return new Promise((resolve, reject) => {
            exec('/usr/bin/ibus engine', (error, stdout, stderr) => {
                if (error) {
                    console.error(`执行错误: ${error}`);
                    reject(error);
                    return;
                }
                console.log(`stdout: ${stdout}`);
                console.error(`stderr: ${stderr}`);
                resolve(stdout);
            });
        });
    }
}