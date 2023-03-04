
# [1] 工程初始化

采用`Mono-repo`项目结构
  > `Multi-repo`结构是多仓库独立，不便于进行协同管理。

采用`pnpm`
  > pnpm自带workspace，创建mono-repo更快捷；pnpm还能够解决幽灵依赖问题。[pnpm的优势](https://juejin.cn/post/7127295203177676837)
  > npm 有package黑洞的问题，yarn采用扁平化处理，解决部分黑洞问题（多版本依赖还是拥有黑洞问题），并且有幽灵依赖问题。pnpm 采用link的方式解决黑洞问题，同时也没有幽灵依赖。

## 安装依赖初始化项目

  * 安装`pnpm`，`npm i -g pnpm`
  * 初始化项目：`pnpm init`
  * 安装eslint：`pnpm i eslint -D -w` ，`-w`代表安装到根目录
  * 初始化eslint：`npx eslint --init`, 初始化eslint, 做相关选择与配置设置
  * 安装ts的eslint插件: `pnpm i -D -w @typescript-eslint/eslint-plugin `
  * 安装prettier: `pnpm i prettier -D -w`并添加`.prettierrc.json`文件。配置风格
  * 由于prettier和eslint存在风格冲突。需要将prettier集成到eslint中：`pnpm i eslint-config-prettier eslint-plugin-prettier -D -w`
    * `eslint-config-prettier`：覆盖ESLint本身的规则配置
    * `eslint-plugin-prettier`：用Prettier来接管修复代码即eslint --fix
  * 新增执行脚本验证效果：`"lint": "eslint --ext .js,.ts,.jsx,.tsx --fix --quiet ./packages"`
  * 安装husky拦截git命令：`pnpm i husky -D -w`,并进行相关配置
    * `npx husky install`  初始化husky
    * `npx husky add .husky/pre-commit "pnpm lint"`  添加钩子
    * 配置脚本`"prepare": "husky install"`确保新项目会执行初始化husky
  * 安装commitlint检查commit信息规范：`pnpm i commitlint @commitlint/cli @commitlint/config-conventional -D -w`，并添加`.commitlintrc.js`文件。配置如下：
    
    ```js
      module.exports = {
        extends: ["@commitlint/config-conventional"] // 使用conventional规范集
      }; 
    ```
    conventional规范集意义：

    提交的类型: 摘要信息 `<type>: <subject>`**请注意冒号后面有一个空格**，常用的type值包括如下:
    *  feat: 添加新功能
    *  fix: 修复 Bug
    *  chore: 一些不影响功能的更改
    *  docs: 专指文档的修改
    *  perf: 性能方面的优化
    *  refactor: 代码重构
    *  test: 添加一些测试代码等等
  * 将commitlint集成到husky: `npx husky add .husky/commit-msg "npx --no-install commitlint -e $HUSKY_GIT_PARAMS"`
  * 配置`tsconfig.json`
  * 安装rollup: `pnpm i -D -w rollup`
  
# [2] JSX转换

## 实现运行时jsx方法、实现打包流程、实现调试打包结果的环境

* 创建/packages/react文件夹，并在react目录下初始化pnpm,`cd /packages/react`; `pnpm init`
  * 实现jsx逻辑
* 创建/packages/shared文件夹，并在shared目录下初始化pnpm,`cd /packages/shared`; `pnpm init`
  * 定义jsx使用的ReactElement数据结构

## 编写rollup打包逻辑

* 实现打包方法 /scripts/rollup/react.config.js , 安装rollup插件`pnpm i -D -w @rollup/plugin-commonjs rollup-plugin-typescript2`
* 配置脚本打包命令`"build:dev":"rollup --bundleConfigAsCjs --config scripts/rollup/react.config.js"`

安装rimraf，每次打包前删除dist

* 安装`pnpm i -D -w rimraf` 
* 修改脚本打包命令`"build:dev":"rimraf dist && rollup --bundleConfigAsCjs --config scripts/rollup/react.config.js"`

安装package.json生成插件

* `pnpm i -D -w rollup-plugin-generate-package-json`, 在react打包配置中进行指定的package.json生成字段


## 实现第一种调试方式

将打包后的 react ，link 到全局 ，然后替换掉cra中的react，来实现调试
  * 跳转至打包后路径 `cd .\dist\node_modules\react\`
  * link `pnpm link --global`
  * 根目录创建cra `npx create-react-app react-demo`  在react-demo目录下执行`pnpm link react --global`,把react包替换成valor-reaact

# [3] Reconciler

协调（reconcile）就是diff,使用了新的数据结构`FiberNode`,也就是react中的虚拟DOM。

## reconciler的工作方式

对于同一个节点，Reconciler比较其ReactElement与fiberNode，生成子fiberNode。并根据比较的结果生成不同标记（插入、删除、移动......），对应不同宿主环境API的执行。

比如，挂载`<div></div>`:

```js
  // React Element <div></div>
  jsx("div")
  // 对应fiberNode
  null
  // 生成子fiberNode
  // 对应标记
  Placement
```
然后将`<div></div>`更新为`<p></p>`：

```js
// React Element <p></p>
jsx("p")
// 对应fiberNode
FiberNode {type: 'div'}
// 生成子fiberNode
// 对应标记
Deletion Placement
```

当所有ReactElement比较完后，会生成一棵fiberNode树，一共会存在两棵fiberNode树（双缓冲技术）：

* current：与视图中真实UI对应的fiberNode树
* workInProgress：触发更新后，正在reconciler中计算的fiberNode树

## Update 数据结构

  Update数据结构用来实现状态更新机制

  Update数据结构目录: `\packages\react-reconciler\src\updateQueue.ts`

  触发更新的方法（例如：useState）触发了 renderRoot 时，需要使用一个数据结构 - Update。


  fiberReconciler 实现创建和更新

  `fiberReconciler.ts`中创建`FiberRootNode`,并与`hostRootNode`链接起来。在`updateContainer`中执行更新队列的更新然后消费，消费调用`scheduleUpdataOnFiber`

  `scheduleUpdataOnFiber` 会调用renderRoot, 执行Reconciler整个递归过程。  首先会调用`prepareFreshStack` -> `createWorkInProgress`来初始化首屏渲染。
