/// <reference types="vite/client" />

declare module 'upng-js' {
  const UPNG: {
    encode(
      bufs: ArrayBuffer[],
      w: number,
      h: number,
      cnum: number,
      dels?: number[],
    ): ArrayBuffer
    decode(buffer: ArrayBuffer): {
      width: number
      height: number
      data: ArrayBuffer
      tabs: Record<string, unknown>
    }
  }
  export default UPNG
}
