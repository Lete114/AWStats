const fs = require('fs'),
    git = require('simple-git'),
    yaml = require("js-yaml"),
    copy = require("./copy"),
    remove = require("./remove"),
    fsWin = require('fswin');

const config = yaml.load(fs.readFileSync("./config.yml",{encoding:"utf8"}))// 获取配置文件并解析配置文件，转换为json数据
// 获取基本配置
const generate_path = config.public
const dir_path = ".deploy_git"
const force = config.deploy.force == true?"-f":"";
const remote = config.deploy.remote
const branch = config.deploy.branch
const commitMsg = config.deploy.commitMsg || "updated: "+new Date().toLocaleDateString() +" "+ new Date().toLocaleTimeString();
const repoURL = config.deploy.repoURL;
var args = []
args.push(force,remote,branch)
if(force=="") args.shift()


try {
    // 判断.deploy_git目录是否存在 存在则删除  反之克隆
    var result = fs.statSync(dir_path).isDirectory()
} catch (error) {
    result = false
}
if(result)remove.removeAll(dir_path)

console.log(`[INFO] Clone branch: ${branch} ...`);
git().raw(["clone","-b",branch,repoURL,dir_path])
    .then(()=>{
        // clone后删除.deploy_git目录下的所有文件和目录(除了.git)
        remove.remove(dir_path)
        let isWin = /^win/.test(process.platform)//判断是否是win系统
        if(isWin) fsWin.setAttributesSync(dir_path, {IS_HIDDEN: true})// 隐藏目录
        // 将生成目录文件复制到.deploy_git目录下
        copy.exists(generate_path,dir_path,copy.copyDir)
        // 延迟1秒push
        setTimeout(function() {
            console.log(`[INFO] Push ...`);
            git(dir_path)
                .add('.')
                .commit(commitMsg)
                .push(args)
                .then(()=>{
                    console.log(`[INFO] Push to ${branch} success`);
                }).catch(error=>{
                    console.log(error);
                })
        }, 1000)
    }).catch(error=>{
        console.log(error);
    })