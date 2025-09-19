import { RingBuffer, AudioWriter, AudioReader } from './ringbuffer';
declare var wasm_bindgen: any;

declare var self: DedicatedWorkerGlobalScope;
export {};

let frame_length: number;
let df_model: any;
let _audio_reader: AudioReader;
let _audio_writer: AudioWriter;
let rawStorage: Float32Array;
let interval: any;
let bypass = false;
let current_suppression_level = 50;

// Read some float32 pcm from the queue, convert to int16 pcm, and push it to
// our global queue.
async function readFromQueue() {
  if (_audio_reader.availableRead() < frame_length) {
    return 0;
  }

  const samples_read = _audio_reader.dequeue(rawStorage);
  let input_frame = rawStorage.subarray(0, samples_read);
  
  let output_frame = bypass ? input_frame : wasm_bindgen.df_process_frame(df_model, input_frame);

  if (_audio_writer.enqueue(output_frame) !== frame_length) {
    console.log("worker underrun: the audioworklet doesn't dequeue fast enough!");
  }

  return samples_read;
}


self.onmessage = async (e: MessageEvent) => {
  switch (e.data.command) {
    case "init": {      
      _audio_reader = new AudioReader(
        new RingBuffer(e.data.rawSab, Float32Array)
      );

      _audio_writer = new AudioWriter(
        new RingBuffer(e.data.denoisedSab, Float32Array)
      );
      
      try {
        const dfJsUrl = e.data.dfJsUrl;
        if (!dfJsUrl) {
          throw new Error('dfJsUrl not provided');
        }
        
        importScripts(dfJsUrl);
        wasm_bindgen.initSync(e.data.bytes);

        const uint8Array = new Uint8Array(e.data.model_bytes);
        df_model = wasm_bindgen.df_create(uint8Array, current_suppression_level);

        frame_length = wasm_bindgen.df_get_frame_length(df_model);
        rawStorage = new Float32Array(frame_length);

        interval = setInterval(readFromQueue, 0);
        self.postMessage({ type: "SETUP_AWP" });
      } catch (error) {
        self.postMessage({ type: "ERROR", error: (error as Error).message });
      }
      break;
    }
    case 'set_suppression_level': {
      const newLevel = e.data.level;
      if (df_model && typeof newLevel === 'number' && newLevel >= 0 && newLevel <= 100) {
        current_suppression_level = newLevel;
        try { wasm_bindgen.df_set_atten_lim(df_model, newLevel); } catch {}
      }
      break;
    }
    case "stop": {
      clearInterval(interval);
      break;
    }
    default: {
      console.log(e.data);
      throw Error("Case not handled");
    }
  }
};

self.postMessage({ type: "FETCH_WASM" });
