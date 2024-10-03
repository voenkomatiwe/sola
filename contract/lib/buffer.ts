import { utils, BN } from "@coral-xyz/anchor";
import { parse as uuidParse, v4 as uuidv4 } from "uuid";

export function padBuffer(buffer: Buffer | Uint8Array, targetSize: number) {
  if (!(buffer instanceof Buffer)) {
    buffer = Buffer.from(buffer);
  }

  if (buffer.byteLength > targetSize) {
    throw new RangeError(`Buffer is larger than target size: ${targetSize}`);
  }

  return Buffer.concat(
    [buffer, Buffer.alloc(targetSize - buffer.byteLength)],
    targetSize
  );
}

export function bufferFromString(str: string, bufferSize?: number) {
  const utf = utils.bytes.utf8.encode(str);

  if (!bufferSize || utf.byteLength === bufferSize) {
    return Buffer.from(utf);
  }

  if (bufferSize && utf.byteLength > bufferSize) {
    throw RangeError("Buffer size too small to fit the string");
  }

  return padBuffer(utf, bufferSize);
}

export function uuidToBn(id: string): BN {
  return new BN(uuidParse(id), "be");
}

export function bnToUuid(id: BN | number[]): string {
  const buf = id instanceof Array ? id : id.toArray("be");

  if (buf.length != 16) {
    throw RangeError("Invalid UUID");
  }

  return uuidv4({ random: buf });
}
