# DeepFilterNet3 Workers

Real-time audio noise filtering using DeepFilterNet3 in Web Workers and AudioWorklets.

## Features

- Real-time noise suppression using DeepFilterNet3 ONNX models
- Web Worker implementation for non-blocking audio processing
- AudioWorklet integration for low-latency audio processing
- WebAssembly (WASM) backend for high performance
- Configurable suppression levels

## Installation

```bash
npm install deepfilternet3-workers
# or
yarn add deepfilternet3-workers
```

## Build Prerequisites

For successful WASM conversion you need:

1. **Install Rust**
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

2. **Install wasm-pack**
   ```bash
   cargo install wasm-pack
   ```

   (You can find it in workflows also - https://github.com/Rikorose/DeepFilterNet/blob/main/.github/workflows/build_wasm.yml)

## Getting WASM Package and Model

To get WASM package and model:

```bash
git clone https://github.com/Rikorose/DeepFilterNet/
cd DeepFilterNet
bash scripts/build_wasm_package.sh
cp -r libdf/pkg ..
cp models/DeepFilterNet3_onnx.tar.gz ../models
```

## Files Structure

```
dist/
├── worker/
│   ├── ringbuffer.js          # Shared ring buffer implementation
│   ├── worker.js              # Main DeepFilter worker
│   └── audio-processor.js     # AudioWorklet processor
├── pkg/                       # WebAssembly files
│   ├── df.js                  # WASM bindings
│   ├── df_bg.wasm            # WebAssembly binary
│   └── ...
└── models/                    # ONNX model files
    └── DeepFilterNet3_onnx.tar.gz
```

## Development

### Build from source

```bash
# Install dependencies
yarn install

# Build the project
yarn build

### Project Structure
src/
└── workers/
    ├── worker.ts              # Main worker implementation
    ├── audio-processor.ts     # AudioWorklet processor
    ├── ringbuffer.ts         # Ring buffer utilities
    └── types.d.ts            # Type definitions
```
