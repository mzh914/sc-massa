import { Args, bytesToU32 } from '@massalabs/as-types';
import {
  Address,
  call,
  callerHasWriteAccess,
  generateEvent,
} from '@massalabs/massa-as-sdk';

export function main(binaryArgs: StaticArray<u8>): StaticArray<u8> {
  const address = new Address(
    "A1ns5TfCD5cMCkx2kZwBE3EBKt1u4LLmvL94owzUoR3HVdKh5NK"
    );
  const binaryResult = call(
    address,
    'triggerValue',
    new Args(),
    0,
  )
  const result = bytesToU32(binaryResult);
  generateEvent('result from the contract ' + result.toString());
  return binaryResult;
}
