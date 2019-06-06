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



var program = require('commander');
var download = require('download-git-repo');
var handlebars = require('handlebars');
var inquirer = require('inquirer');

var fs = require('fs');

program
    .version('0.1.0')
    // .option('-p, --peppers', 'Add peppers')
    // .option('-P, --pineapple', 'Add pineapple')
    // .option('-b, --bbq-sauce', 'Add bbq sauce')
    // .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')

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
        var downloadUrl = templates[template].downloadUrl;
        download(downloadUrl,project,(err) => {
            if(err){
                console.log(err);
                console.log("下载失败");
            }else{
                console.log("下载成功");
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
                        console.log(answers);
                        const packageContent = fs.readFileSync(`$(project)/package.json`,'utf8');
                        handlebars.compile(packageContent)(answers) // 编译读取到的package.json模板并填充数据
                    });
            }
        })
    });

/*program
    .command('exec <cmd>')
    .alias('ex')
    .description('execute the given remote cmd')
    .option("-e, --exec_mode <mode>", "Which exec mode to use")
    .action(function(cmd, options){
        console.log('exec "%s" using %s mode', cmd, options.exec_mode);
    }).on('--help', function() {
    console.log('');
    console.log('Examples:');
    console.log('');
    console.log('  $ deploy exec sequential');
    console.log('  $ deploy exec async');
});*/

/*
program
    .command('*')
    .action(function(env){
        console.log('deploying "%s"', env);
    });
*/

program.parse(process.argv);


/*console.log('you ordered a pizza with:');
if (program.peppers) console.log('  - peppers');
if (program.pineapple) console.log('  - pineapple');
if (program.bbqSauce) console.log('  - bbq');
console.log('  - %s cheese', program.cheese);*/
