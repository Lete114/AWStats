// deploy 部署

const fs = require('fs'),
    path = require('path'),
    git = require('simple-git'),
    yaml = require('js-yaml'),
    { removeAll, copy_before } = require('./utils');

const root_config = path.resolve('./config.yml')
const config = yaml.load(fs.readFileSync(root_config, { encoding: 'utf8' }))// 获取配置文件并解析配置文件，转换为json数据
// 获取基本配置
const generate_path = path.resolve(config.public)
const git_deploy_path = path.resolve('.deploy_git')
const force = config.deploy.force == true ? '-f' : '';
const remote = config.deploy.remote
const branch = config.deploy.branch
const commitMsg = config.deploy.commitMsg || `updated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
const repoURL = config.deploy.repoURL;
var args = []
args.push(force, remote, branch)
if (force == '') args.shift()

if (fs.existsSync(git_deploy_path)) removeAll(git_deploy_path)

console.log(`[INFO] Clone branch: ${branch} ...`);

git()
    .clone(repoURL, git_deploy_path, branch)
    .then(() => {
        // 将public(生成)目录的所有文件复制到.deploy_git目录下
        copy_before(generate_path, git_deploy_path)
        console.log(`[INFO] Push ...`);
        git(git_deploy_path)
            .add('.')
            .commit(commitMsg)
            .push(args)
            .then(() => {
                console.log(`[INFO] Push to ${branch} success`);
            })
            .catch(error => {
                console.error('[ERROR] push失败(请确保仓库已存在指定分支)');
                console.error(error);
            })
    })