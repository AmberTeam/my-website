import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/script.js', // Assuming your main JS file is src/script.js
  output: {
    dir: 'dist',        // Output to a directory
    format: 'esm'       // Use ES Modules format
  },
  plugins: [
    resolve({ browser: true }),
    commonjs()
  ]
};