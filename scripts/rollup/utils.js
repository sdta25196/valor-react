import path from 'path'
import fs from 'fs'
import ts from 'rollup-plugin-typescript2'
import cjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'

const pkgPath = path.resolve(__dirname, '../../packages')
const distPath = path.resolve(__dirname, '../../dist/node_modules')

// 解析指定包名所在路径
export function resolvePkgPath(pkgName, isDist) {
  if (isDist) {
    return `${distPath}/${pkgName}`
  }

  return `${pkgPath}/${pkgName}`
}

// 解析指定包名下的 package.json 文件
export function getPackageJSON(pkgName) {

  const path = `${resolvePkgPath(pkgName)}/package.json`

  const str = fs.readFileSync(path, { encoding: 'utf8' })

  return JSON.parse(str)

}
// 基础 rollup 插件
export function getBaseRollupPlugins({
  typescript = {},
  alias = {
    __DEV__: true,
    preventAssignment: true
  }
} = {}) {
  return [replace(alias), cjs(), ts(typescript)]
}