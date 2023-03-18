import { getPackageJSON, resolvePkgPath, getBaseRollupPlugins } from './utils'
import generatePackageJson from 'rollup-plugin-generate-package-json'
import alias from '@rollup/plugin-alias'

const { name, module, peerDependencies } = getPackageJSON('react-dom')

// react-dom 包路径
const pkgPath = resolvePkgPath(name)

// react-dom 产物路径
const distPkgPath = resolvePkgPath(name, true)

export default [
  // react-dom
  {
    input: `${pkgPath}/${module}`,
    output: [
      {
        file: `${distPkgPath}/index.js`,
        name: 'ReactDOM',
        format: 'umd'
      },
      {
        file: `${distPkgPath}/client.js`,
        name: 'client',
        format: 'umd'
      },
    ],
    external: [
      ...Object.keys(peerDependencies)
    ],
    plugins: [...getBaseRollupPlugins(),
    // 别名插件
    alias({
      entries: {
        hostConfig: `${pkgPath}/src/hostConfig.ts`
      }
    }),
    generatePackageJson({
      inputFolder: pkgPath,
      outputFolder: distPkgPath,
      baseContents: ({ name, description, version }) => ({
        name,
        description,
        version,
        peerDependencies: {
          react: version
        },
        main: 'index.js'
      })
    })],
  },
  // react-test-utils
  {
    input: `${pkgPath}/test-utils.ts`,
    output: [
      {
        file: `${distPkgPath}/test-utils.js`,
        name: 'testUtils',
        format: 'umd'
      },
    ],
    external: ['react-dom', 'react'],
    plugins: [...getBaseRollupPlugins()],
  }
]