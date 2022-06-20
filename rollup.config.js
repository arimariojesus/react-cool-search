import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import copy from 'rollup-plugin-copy';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';
import { terser } from 'rollup-plugin-terser';

import pkg from './package.json';

const isDev = process.env.BUILD !== 'production';

const makeExternalPredicate = external =>
  !external.length
    ? () => false
    : id => new RegExp(`^(${external.join('|')})($|/)`).test(id);

const cjs = {
  file: pkg.main,
  format: 'cjs',
  exports: 'named',
  sourcemap: true,
  plugins: !isDev && [terser()],
};

const esm = {
  file: pkg.module,
  format: 'esm',
  exports: 'named',
  sourcemap: true,
};

const extensions = ['.js', '.ts', '.tsx', '.json'];
const plugins = [
  resolve({ extensions }),
  commonjs(),
  babel({ exclude: 'node_modules/**', extensions }),
  replace({
    'process.env.NODE_ENV': JSON.stringify(
      isDev ? 'development' : 'production',
    ),
  }),
  !isDev && sizeSnapshot(),
  copy({
    targets: [
      {
        src: 'src/react-cool-search.d.ts',
        dest: pkg.types.split('/')[0],
        rename: 'index.d.ts',
      },
    ],
  }),
].filter(Boolean);

export default {
  input: 'src',
  output: isDev ? [esm] : [cjs, esm],
  plugins,
  external: makeExternalPredicate([...Object.keys(pkg.peerDependencies)]),
};
