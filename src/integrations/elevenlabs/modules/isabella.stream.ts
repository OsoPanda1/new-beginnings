/**
 * 🌊 Isabella Streaming Module
 * 
 * Real-time voice streaming for Isabella AI™
 */

import { ElevenLabsClient } from '../core/elevenlabs.client';
import { EmotionalContext } from '../core/elevenlabs.types';

/**
 * Stream Isabella's speech in real-time
 */
export async function streamIsabellaSpeech(
  text: string,
  emotionalContext?: EmotionalContext,
  onChunk?: (chunk: Uint8Array) => void
): Promise<ReadableStream<Uint8Array>> {
  try {
    const stream = await ElevenLabsClient.streamSpeech({
      text,
      emotionalContext,
    });

    if (onChunk) {
      const reader = stream.getReader();
      const readStream = new ReadableStream({
        async start(controller) {
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              if (value) {
                onChunk(value);
                controller.enqueue(value);
              }
            }
            controller.close();
          } catch (error) {
            controller.error(error);
          }
        },
      });
      return readStream;
    }

    return stream;
  } catch (error) {
    console.error('Isabella Stream Error:', error);
    throw new Error('Unable to stream Isabella\'s voice');
  }
}

/**
 * Stream and play Isabella's voice with progressive audio
 */
export async function streamAndPlayIsabella(
  text: string,
  emotionalContext?: EmotionalContext
): Promise<void> {
  const audioContext = new AudioContext();
  const chunks: Uint8Array[] = [];

  await streamIsabellaSpeech(text, emotionalContext, (chunk) => {
    chunks.push(chunk);
  });

  // Combine all chunks
  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const combinedChunks = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    combinedChunks.set(chunk, offset);
    offset += chunk.length;
  }

  // Decode and play
  const audioBuffer = await audioContext.decodeAudioData(combinedChunks.buffer);
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioContext.destination);
  
  return new Promise((resolve) => {
    source.onended = () => resolve();
    source.start();
  });
}
