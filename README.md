
# [1]

采用`Mono-repo`项目结构
  > `Multi-repo`结构是多仓库独立，不便于进行协同管理。

采用`pnpm`
  > pnpm自带workspace，创建mono-repo更快捷；pnpm还能够解决幽灵依赖问题。[pnpm的优势](https://juejin.cn/post/7127295203177676837)


## TODOLIST
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