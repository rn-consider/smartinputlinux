// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below 
import * as vscode from 'vscode';
import { Ibus } from './input/ibus';
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
// 检查是否处在注释中,以及开头是否为英文，如果文本为空那么返回false
function isCommentLine(text: string): boolean {   
    text = text.trim(); // 获取当前行的文本，并去除前后的空白字符
    return text.startsWith('*') || text.startsWith('//') || text.startsWith('/*') || text.startsWith('#') || text.startsWith('<!--') ||text.startsWith('-') ;
}
// 检查获得的文本是否为空
function isEmpty(text: string): boolean {
    return text.trim().length === 0;
}
// 判断vim是否处在插入模式     
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
    const config = vscode.workspace.getConfiguration('SmartInputLinux');
    const chineseCursorColor: string = config.get('chineseCursorColor') || '#00FF00'; // 如果没有获取到配置值，则使用默认值 '#00FF00'
    const isWithVim: string = config.get('isWithVim') || 'true'; // 如果没有获取到配置值，则使用默认值 '#00FF00'
    const englishCursorColor: string = config.get('englishCursorColor') || '#FFFFFF'; // 如果没有获取到配置值，则使用默认值 '#FFFFFF'
    const chineseInputMethod: string = config.get('chineseInputMethod') || 'pinyin'; // 如果没有获取到配置值，则使用默认值 'pinyin' 
    let ibus = new Ibus(chineseCursorColor, englishCursorColor);
    let inCommentLine = false; // 添加一个变量来跟踪当前是否在注释行中
    //  如果使用vim
    if(isWithVim === 'true') { 
        context.subscriptions.push(vscode.window.onDidChangeTextEditorOptions(async (e: vscode.TextEditorOptionsChangeEvent) => {
            // 当光标样式为1，判断当前文本是否为空如果为空那么切换为英文输入法
            if (e.options.cursorStyle === 1) {
                const activeEditor = vscode.window.activeTextEditor;
                if (activeEditor) {
                    const line = activeEditor.selection.active.line;
                    const text = activeEditor.document.lineAt(line).text;
                    if (isEmpty(text)) {
                        ibus.ChangeInputToEnglish('xkb:us::eng'); // 设置英文输入法
                        ibus.SetEnglishCursorColor(); // 设置光标颜色
                    }
                }
            }
            if (e.options.cursorStyle === 2) {
                ibus.ChangeInputToEnglish('xkb:us::eng'); // 设置英文输入法
                ibus.SetEnglishCursorColor(); // 设置光标颜色
            }
        }));
        // 逻辑就是监听光标移动事件^_^
        // 当光标移动到注释行中时，如果现在的样式为1，也就是Vim插入模式下光标样式则切换为中文输入法
        context.subscriptions.push(
            vscode.window.onDidChangeTextEditorSelection(async (event) => {
                if(event.textEditor.options.cursorStyle === 1) {
                    const line = event.selections[0].active.line;
                    const text = event.textEditor.document.lineAt(line).text;
                    let isNowInCommentLine = isCommentLine(text); // 检查当前是否在注释行中
                    if (isNowInCommentLine !== inCommentLine) { // 只有当状态发生改变时，才切换输入法
                        inCommentLine = isNowInCommentLine; // 更新状态
                        if (inCommentLine) {
                            // vscode.window.showInformationMessage('当前光标在注释行中，切换为中文输入法!');
                            ibus.ChangeInputToChinese(chineseInputMethod);
                        } else {
                            // vscode.window.showInformationMessage('当前光标不在注释行中!');
                            ibus.ChangeInputToEnglish('xkb:us::eng');
                        }
                    }
                }  
            })
        );
    // context.subscriptions.push(
    //     vscode.workspace.onDidChangeTextDocument(async (event) => {
    //         const activeEditor = vscode.window.activeTextEditor;
    //         if (activeEditor && activeEditor.options.cursorStyle === 2) {
    //             if (event.contentChanges.length > 0) {
    //                 const change = event.contentChanges[0];
    //                 if (change.text === 'o' || change.text === 'O') {
    //                     ibus.ChangeInputToEnglish('xkb:us::eng');
    //                 }
    //             }
    //         }
    //     })
    // );
        // 如果处在vim insert下，那么根据行是否处在注释行中来判断是否切换输入法
        // context.subscriptions.push(
        //     vscode.window.onDidChangeTextEditorOptions(async (event) => {
        //         if(event.options.cursorStyle === 1) {
        //             const activeEditor = vscode.window.activeTextEditor;
        //             if (activeEditor) {
        //                 const line = activeEditor.selection.active.line;
        //                 const text = activeEditor.document.lineAt(line).text;
        //                 let isNowInCommentLine = isCommentLine(text); // 检查当前是否在注释行中
        //                 if (isNowInCommentLine) { // 如果在注释行中，切换到中文输入法
        //                     ibus.ChangeInputToChinese('pinyin');
        //                 } else { // 如果不在注释行中，切换到英文输入法
        //                     ibus.ChangeInputToEnglish('xkb:us::eng');
        //                 }
        //             }
        //         }
        //     })
        // );
    }
   
    // 窗口获得焦点时，切换为英文输入法，窗口失去焦点时切换为中文输入法
    context.subscriptions.push(vscode.window.onDidChangeWindowState(async (state) => {
        if (state.focused) {
            ibus.ChangeInputToEnglish('xkb:us::eng');
        }
        else {
            ibus.ChangeInputToChinese('pinyin');
        }
    }));

}
// This method is called when your extension is deactivated
export function deactivate() {}
