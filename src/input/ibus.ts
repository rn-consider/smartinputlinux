import { exec } from 'child_process';
export class Ibus {
    ChangeInputToChinese(input: string): void {
        exec(`/usr/bin/ibus engine ${input}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`执行错误: ${error}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
        });
    }
    ChangeInputToEnglish(input: string): void {
            exec('/usr/bin/ibus engine xkb:us::eng', (error, stdout, stderr) => {
            if (error) {
                console.error(`执行错误: ${error}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
        });
    }
    /**
        ibus.ObtainIM().then(output => {
        console.log(output); // 输出命令的输出
        }).catch(error => {
            console.error(error); // 输出错误信息
        });
    **/
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