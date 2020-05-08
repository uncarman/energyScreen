## 嘉兴省6栋大楼监控大屏项目
### 环境配置:
#### 1. 安装 `Node.js` 和 `npm`
要检查你正在使用的版本，请在终端窗口中运行 
```
node -v
```
和
```
npm -v
```
本项目依赖Node包管理工具（`npm`）管理项目所需的第三方库文件

<br/>

#### 2. 解压项目
cd energyScreen

#### 3. 安装依赖包
当基本环境确认无误后，在终端命令行中进入本项目根目录，并输入以下命令，使用`npm`来安装`package.json`中列出的依赖包
```
npm install
```
输入该指令后工程目录下应当会出现新的依赖文件夹node_modules，注意安装过程中应当不出现`npm ERR!`信息
> 提示：<br>
　　由于`npm`原资源地址由于网络原因可能出现下载缓慢甚至出错的情况，建议修改`npm`下载地址至淘宝的镜像下载源
>```
>npm config set registry https://registry.npm.taobao.org
>```
>之后输入以下命令确认修改是否成功
>```
>npm info underscore
>```


## 关于运行
#### 调试模式
在conf/test.json中完成配置后，直接运行
```
npm start 或 npm run test
```
<br/>

#### 正式运行
在conf/prod.json中完成配置后，直接运行
```
npm run prod
```
<br/>


### 目录结构以及说明：
    |-- conf  -- 包含所有配置相关文件
    |-- src
        |-- model-- 数据处理模块
            |-- app.js  -- 应用逻辑入口
            |-- handler.js  -- ajax主业务逻辑
            |-- dbMysql.js  -- mysql工具
            |-- sql.js  -- sql 语句
            |-- getmime.js
            |-- getmimefromfile.js
            |-- moment-with-locales.min.js  -- moment
        |-- static-- 前端逻辑模块
            |-- css
            |-- image
            |-- js
                |-- libs
                |-- comm.js  -- 前端逻辑基础模块
                |-- dashboard.js  -- 大屏页面前端逻辑
            |-- 404.html  -- 前端统一404页面
            |-- index.html  -- 前端首页文件
            |-- login.html
        |-- index.js  -- 服务启动入口
        |-- mime.json
    |-- test
    |-- README.md



###页面和通讯服务端数据传输格式
a)发送查询命令：SELECT|参数编码1|参数编码2|…|END
        服务器返回json数据格式。
b)发送配置命令：CONFIG|参数编码|值|END
        服务器返回json数据格式。
c)发送刷新模式缓存命令：REFRESH|MODULE|END
d)发送控制与反馈值比对命令：
COMPARE|区域id|设备名称|反馈参数编码|控制参数编码|控制参数编码值|比对时间间隔（分）|END

返回json数据格式

"SELECT|Bacnet.2F.L-201A_40001.PresentValue|END"
{\"command\":\"SELECT\",\"dataList\":[{\"command\":\"HANDLE\",\"dateTime\":\"2020-04-27 14:55:33\",\"serverCode\":\"86081272\",\"state\":\"Good\",\"sysCode\":\"light\",\"tagCode\":\"Bacnet.2F.L-201A_40001.PresentValue\",\"tagNumber\":\"86248912\",\"value\":\"0\",\"valueType\":\"Boolean\"}]}