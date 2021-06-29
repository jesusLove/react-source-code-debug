React 源码本地调试环境。

> 版本 v17+

# 本环境配置

1. 克隆 react 项目，安装依赖

```shell
# 克隆项目
git clone https://github.com/facebook/react.git
# 进入项目目录
cd react
# 安装依赖
yarn
```

> 仓库 src/react 中是 react 源码。


2. 打包

```shell
yarn build react/index react/jsx react-dom/index scheduler --type=NODE
```
> 打包后会生成 build 文件


3. 创建软连接

```shell
cd build/node_modules/react
yarn link 

cd build/node_modules/react-dom
yarn link
```

4. 创建 react 项目

```shell
npx create-react-app my-app

# 将项目内的 react, react-dom 指向前面的软连接声明。
yarn link react react-dom
```