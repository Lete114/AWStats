<h1 align="center"><a href="https://github.com/lete114/AWStats" target="_blank">AWStats</a></h1>
<p align="center"> A fast , static files generator framework , powered by <a href="https://nodejs.org" title="https://nodejs.org">Node.js</a></p>

<p align="center">
    <a href="https://github.com/lete114/AWStats/releases/"><img src="https://img.shields.io/github/package-json/v/lete114/AWStats/master?color=%23e58a8a&label=master" alt="master"></a>
    <img src="https://img.shields.io/github/package-json/v/lete114/AWStats/dev?color=%231ab1ad&label=dev" alt="dev">
    <a href="https://github.com/lete114/AWStats/blob/master/LICENSE"><img src="https://img.shields.io/github/license/lete114/AWStats?color=FF5531" alt="MIT License"></a>
</p>

## Quick Start

> 前提：你的电脑必须安装[Node.js](https://nodejs.org/)才能启动该项目

**Install AWStats**

```bash
npm install awstats-cli -g
```

**Initialize AWStats**

```bash
awstats init AWStats-HomePage

cd AWStats-HomePage # 进入初始化的目录

## 你也可用使用以下方式

mkdir AWStats-HomePage # 创建目录(自定义)

cd AWStats-HomePage # 进入创建的目录

awstats init # 初始化
```

**Other Commands**

```bash
awstats init # 初始化 可缩写为: aws i

awstats generate # 生成 aws g (以此类推输入首字母即可)

awstats minify # 压缩

awstats server # 本地预览

awstats deploy # 部署

awstats clean # 清理
```

## Themes

> 如没有`themes`目录可自建

在 themes 目录下可以新建你的主题(例如：`./themes/HomePage`)，主题文件下可以新建`config.yml`主题配置文件，新建`template`目录，存放你要生成的页面(文件后缀为.ejs)，`static`静态资源

可以参考：[HomePage](https://github.com/lete114/AWStats-theme-HomePage)

```
lib
    |-- xxx
themes
    |-- HomePage
        |-- static
            |-- css
            |-- js
            |-- images
            |-- fonts
            |-- xxxxxx
        |-- template
            |-- index.ejs
            |-- 404.ejs
            |-- xxxx(可新建文件夹)
config.yml
package.json
```

`HomePage`: 主题昵称

`static`: 静态资源

`template`: 模板

## License

[MIT](LICENSE)
