declare var self: DedicatedWorkerGlobalScope;
declare var AudioWorkletProcessor: {
  prototype: AudioWorkletProcessor;
  new(options?: any): AudioWorkletProcessor;
};

interface AudioWorkletProcessor {
  process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>): boolean;
}

declare function registerProcessor(name: string, processorCtor: typeof AudioWorkletProcessor): void;

declare global {
  var wasm_bindgen: any;
  function importScripts(...urls: string[]): void;
}
