import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from "rollup-plugin-terser";

export default [
  {
  input: 'esmwrapper.js',
  output: {
    file: 'dist/esm/fuzzball.esm.min.js',
    format: 'es',
    name: 'fuzzball',
    exports: 'named',
  },
  plugins: [commonjs(), nodeResolve(), terser({keep_fnames: true}) ],
},
{
  input: './fuzzball.js',
  output: {
    file: 'dist/fuzzball.umd.min.js',
    format: 'umd',
    name: 'fuzzball'
  },
  plugins: [commonjs(), nodeResolve(), terser({keep_fnames: true})],
},
{
  input: './lite/fuzzball_lite.js',
  output: {
    file: 'lite/fuzzball_lite.umd.min.js',
    format: 'umd',
    name: 'fuzzball'
  },
  plugins: [commonjs(), nodeResolve(), terser({keep_fnames: true})],
},
{
  input: './lite/esmwrapper_lite.js',
  output: {
    file: 'lite/esm/fuzzball_lite.esm.min.js',
    format: 'es',
    name: 'fuzzball',
    exports: 'named',
  },
  plugins: [commonjs(), nodeResolve(), terser({keep_fnames: true})],
},
{
  input: './ultra_lite/fuzzball_ultra_lite.js',
  output: {
    file: 'ultra_lite/fuzzball_ultra_lite.umd.min.js',
    format: 'umd',
    name: 'fuzzball'
  },
  plugins: [commonjs(), nodeResolve(), terser({keep_fnames: true})],
},
{
  input: './ultra_lite/esmwrapper_ultra_lite.js',
  output: {
    file: 'ultra_lite/esm/fuzzball_ultra_lite.esm.min.js',
    format: 'es',
    name: 'fuzzball',
    exports: 'named',
  },
  plugins: [commonjs(), nodeResolve(), terser({keep_fnames: true})],
},
];