import pkg from './package.json';

export default {
  input: './src/index.mjs',
  output: {
    file: './src/index.cjs',
    format: 'cjs',
    name: pkg.name,
    sourcemap: false,
    exports: 'named',
  },
  acorn: {
    allowReserved: true,
    ecmaVersion: 9,
  },
};
