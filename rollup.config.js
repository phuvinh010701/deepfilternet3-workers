import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

export default [
  // Build shared ringbuffer module
  {
    input: 'src/workers/ringbuffer.ts',
    output: {
      file: 'dist/worker/ringbuffer.js',
      format: 'iife',
      name: 'ringbuffer'
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfig: 'src/workers/tsconfig.json'
      })
    ]
  },
  // Build the worker files
  {
    input: 'src/workers/worker.ts',
    external: ['./ringbuffer'],
    output: {
      file: 'dist/worker/worker.js',
      format: 'iife',
      name: 'DeepFilterWorker',
      globals: {
        './ringbuffer': 'ringbuffer'
      }
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfig: 'src/workers/tsconfig.json'
      })
    ]
  },
  // Build audio processor
  {
    input: 'src/workers/audio-processor.ts',
    external: ['./ringbuffer'],
    output: {
      file: 'dist/worker/audio-processor.js',
      format: 'iife',
      name: 'AudioProcessor',
      globals: {
        './ringbuffer': 'ringbuffer'
      }
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfig: 'src/workers/tsconfig.json'
      })
    ]
  }
];