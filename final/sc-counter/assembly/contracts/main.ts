import { Args, bytesToU32, stringToBytes, u32ToBytes } from '@massalabs/as-types';
import { Storage, callerHasWriteAccess, generateEvent } from '@massalabs/massa-as-sdk';

export function constructor(): StaticArray<u8> {
  // This line is important. It ensures that this function can't be called in the future.
  // If you remove this check, someone could call your constructor function and reset your smart contract.
  if (!callerHasWriteAccess()) {
    return [];
  }
  initialize();
  return [];
}

export function initialize(): void {
  Storage.set(stringToBytes('counter'), u32ToBytes(0));
}

export function increment(toInc: StaticArray<u8>): StaticArray<u8> {
  let counter: u32 = bytesToU32(Storage.get(stringToBytes('counter')));
  const arg = new Args(toInc);
  counter += arg.nextU32().expect("no value given");
  Storage.set(stringToBytes('counter'), u32ToBytes(counter));
  return [];
}

export function triggerValue(_: StaticArray<u8>): StaticArray<u8> {
  const counter = Storage.get(stringToBytes('counter'));
  generateEvent("" + (bytesToU32(counter).toString()));
  return counter;
}
