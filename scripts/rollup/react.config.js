import { getPackageJSON, resolvePkgPath, getBaseRollupPlugins } from './utils'
import generatePackageJson from 'rollup-plugin-generate-package-json'

const { name, module } = getPackageJSON('react')

// react 包路径
const pkgPath = resolvePkgPath(name)

// react 产物路径
const distPkgPath = resolvePkgPath(name, true)

export default [
  {
    input: `${pkgPath}/${module}`,
    output: {
      file: `${distPkgPath}/index.js`,
      name: 'react',
      format: 'umd'
    },
    plugins: [...getBaseRollupPlugins(), generatePackageJson({
      inputFolder: pkgPath,
      outputFolder: distPkgPath,
      baseContents: ({ name, description, version }) => ({ name, description, version, main: 'index.js' })
    })],
  },
  {
    input: `${pkgPath}/src/jsx.ts`,
    output: [
      {
        file: `${distPkgPath}/jsx-runtime.js`,
        name: 'jsx-runtime.js',
        format: 'umd'
      },
      {
        file: `${distPkgPath}/jsx-dev-runtime.js`,
        name: 'jsx-dev-runtime.js',
        format: 'umd'
      }
    ],
    plugins: getBaseRollupPlugins(),
  }
]