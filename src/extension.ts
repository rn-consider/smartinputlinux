// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Ibus } from './input/ibus';
const chineseCursorColor = '#00FF00'; // 设置中文光标颜色
const englishCursorColor = '#FFFFFF'; // 设置英文光标颜色
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function isCommentLine(text: string): boolean {
    text = text.trim(); // 获取当前行的文本，并去除前后的空白字符
    return text.startsWith('//') || text.startsWith('/*') || text.startsWith('#') || text.startsWith('<!--') ;
}
// 判断是否安装了vim插件
function isVimOn(): boolean {
	let isvimon = false;
	for (let ext of vscode.extensions.all) {
		if (ext.id.includes('vim') && ext.isActive) {
			isvimon = true;
			break;
		}
	}
	return isvimon;
}
// 用于改变光标颜色
function setCursorColor(color: string) {
    vscode.workspace.getConfiguration().update('workbench.colorCustomizations', {
        'editorCursor.foreground': color
    }, vscode.ConfigurationTarget.Global);
}
// 用于还原光标颜色
function resetCursorColor() {
    let colorCustomizations: any = vscode.workspace.getConfiguration('workbench').get('colorCustomizations');
    if (colorCustomizations && typeof colorCustomizations === 'object' && 'editorCursor.foreground' in colorCustomizations) {
        delete colorCustomizations['editorCursor.foreground'];
        vscode.workspace.getConfiguration('workbench').update('colorCustomizations', colorCustomizations, vscode.ConfigurationTarget.Global);
    } else {
        vscode.workspace.getConfiguration('workbench').update('colorCustomizations', {}, vscode.ConfigurationTarget.Global);
    }
}
/**
 * 获取配置信息。
 * 
 * @remarks
 * 此函数用于获取 VSCode 的配置信息，包括光标样式、光标颜色、输入法设置等。
 * 
 * @returns 无返回值。
 */
function getConfiguration() {
	// out.info('get configuration.');
}
export function activate(context: vscode.ExtensionContext) {
    let ibus = new Ibus();
    let inCommentLine = false; // 添加一个变量来跟踪当前是否在注释行中
    // 注册事件监听器
    vscode.window.onDidChangeTextEditorSelection((event) => {
        let editor = event.textEditor;
        let position = editor.selection.active; // 获取当前光标的位置
        let line = editor.document.lineAt(position.line); // 获取当前行
        let text = line.text;
        let isNowInCommentLine = isCommentLine(text); // 检查当前是否在注释行中
        if (isNowInCommentLine !== inCommentLine) { // 只有当状态发生改变时，才切换输入法
            inCommentLine = isNowInCommentLine; // 更新状态
            if (inCommentLine) {
                vscode.window.showInformationMessage('当前光标在注释行中，切换为中文输入法!');
                ibus.ChangeInputToChinese('pinyin');
				setCursorColor(chineseCursorColor);
            } else {
                vscode.window.showInformationMessage('当前光标不在注释行中!');
                ibus.ChangeInputToEnglish('xkb:us::eng');
				setCursorColor(englishCursorColor);
            }
        }
    });
}
// This method is called when your extension is deactivated
export function deactivate() {}
