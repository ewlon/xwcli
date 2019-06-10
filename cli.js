#!/usr/bin/env node

const templates={
    "common": {
        "url": "https://github.com/lollipopable/common",
        "downloadUrl": "lollipopable/common",
        "description": "普通模板"
    },
    "webpack": {
        "url": "https://github.com/lollipopable/xw-active-webpack",
        "downloadUrl": "lollipopable/xw-active-webpack",
        "description": "webpack模板"
    }
}
// 原生获取命令行参数（只是演示，后面用commander代替）
// console.log(process.argv)



const program = require('commander');
const download = require('download-git-repo');
const handlebars = require('handlebars');
const inquirer = require('inquirer');
const ora = require('ora');
const chalk = require('chalk');

const fs = require('fs');

program
    .version('0.1.0')

program
    .command('list')
    .description('查看所有可以使用的模板')
    // .option("-s, --setup_mode [mode]", "Which setup mode to use")
    .action(() => {
        for ( var infor in templates){
            console.log(`${infor}   ${templates[infor].description}`);
        }

    });

program
    .command('init <template> <project>')
    .description('初始化模板')
    .action(function(template,project){
        const spinner = ora('正在下载模板...').start();
        var downloadUrl = templates[template].downloadUrl;
        download(downloadUrl,project,(err) => {
            if(err){
                spinner.fail();
                console.log(err);
                console.log(chalk.red('初始化模板失败'));
            }else{
                spinner.succeed();
                // 采集用户输入信息,通过模板引擎来生成package.json
                inquirer
                    .prompt([/* Pass your questions in here */
                        {
                            type: "input",
                            name: "name",
                            message: "请输入项目名称"
                        },
                        {
                            type: "input",
                            name: "description",
                            message: "请输入项目描述"
                        },
                        {
                            type: "input",
                            name: "author",
                            message: "请输入作者名称"
                        }
                    ])
                    .then(answers => {
                        // Use user feedback for... whatever!!
                        let packageContent = fs.readFileSync(`${project}/package.json`,'utf8');
                        packageContent = handlebars.compile(packageContent)(answers) // 编译读取到的package.json模板并填充数据
                        fs.writeFileSync(`${project}/package.json`,packageContent);
                        console.log(chalk.green('初始化模板成功'));
                    });


            }
        })
    });



program.parse(process.argv);



