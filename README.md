# AWStats

一个静态生成器，快来定义您的页面吧！

# 使用

> 前提：你的电脑必须安装[Node.js](https://nodejs.org/)才能启动该项目

```bash
npm run build # 生成页面

npm run server # 本地预览(默认执行npm run build)

npm run minify # 压缩页面

npm rnu clean # 清除已生成的页面

npm run deploy # 部署
```

# Themes 

> 如没有`themes`目录可自建

在themes目录下可以新建你的主题(例如：`./themes/WebStack`)，主题文件下可以新建`config.yml`主题配置文件，新建`template`目录，存放你要生成的页面(文件后缀为.ejs)，`static`静态资源

可以参考：[WebSatck](https://github.com/lete114/WebStack)

```
lib
    |-- xxx
themes
    |-- WebSatck
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

`WebSatck`: 主题昵称

`static`: 静态资源

`template`: 模板

# 配置

> 本地预览默认是114端口，可以在配置文件内添加`port`来自定义端口

```yml
#--------------------------------------------------------
# AWStats
# 项目地址：https://github.com/lete114/AWStats
# 一个静态静态生成器
#--------------------------------------------------------

themes: WebStack ## 主题名称
public: public ## 渲染后输出的路径

# 压缩
minify: 
  log: true # 是否打印日志
  html: true
  css: true
  js: true

# 部署
deploy:
  repoURL:  # 部署的仓库
  remote: origin 
  branch: master # 分支
  force: false # 是否开启强制提交
  commitMsg: # 提交的信息，默认：系统当前时间
```
