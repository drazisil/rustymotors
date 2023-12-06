import { describe, test, expect } from "vitest";
import { unpackBlob, unpackBool, unpackByte, unpackFloat, unpackLengthShort, unpackLong, unpackShort, unpackStringFixed, unpackStringVar } from './unpackers.js';

describe('unpackers', () => {
    describe('unpackShort', () => {
        test('unpacks a short in big endian', () => {
            const data = Buffer.from([0x01, 0x02]);
            const result = unpackShort('BE', data);
            expect(result).toEqual(0x0102);
        });
        test('unpacks a short in ltesttle endian', () => {
            const data = Buffer.from([0x01, 0x02]);
            const result = unpackShort('LE', data);
            expect(result).toEqual(0x0201);
        });
    });
    describe('unpackByte', () => {
        test('unpacks a byte in big endian', () => {
            const data = Buffer.from([0x01]);
            const result = unpackByte('BE', data);
            expect(result).toEqual(0x01);
        });
        test('unpacks a byte in ltesttle endian', () => {
            const data = Buffer.from([0x01]);
            const result = unpackByte('LE', data);
            expect(result).toEqual(0x01);
        });
    });
    describe('unpackLong', () => {
        test('unpacks a long in big endian', () => {
            const data = Buffer.from([0x01, 0x02, 0x03, 0x04]);
            const result = unpackLong('BE', data);
            expect(result).toEqual(0x01020304);
        });
        test('unpacks a long in ltesttle endian', () => {
            const data = Buffer.from([0x01, 0x02, 0x03, 0x04]);
            const result = unpackLong('LE', data);
            expect(result).toEqual(0x04030201);
        });
    });
    describe('unpackBlob', () => {
        test('unpacks a blob', () => {
            const data = Buffer.from([0x01, 0x02, 0x03, 0x04]);
            const result = unpackBlob('BE', data);
            expect(result).toStrictEqual(data);
        });
        test('unpacks a blob wtesth a length', () => {
            const data = Buffer.from([0x01, 0x02, 0x03, 0x04]);
            const result = unpackBlob('BE', data);
            expect(result).toStrictEqual(data);
        });
    });
    describe('unpackFloat', () => {
        test('unpacks a float in big endian', () => {
            const data = Buffer.from([0x00, 0x00, 0x00, 0x00]);
            const result = unpackFloat('BE', data);
            expect(result).toEqual(0);
        });
        test('unpacks a float in ltesttle endian', () => {
            const data = Buffer.from([0x00, 0x00, 0x00, 0x00]);
            const result = unpackFloat('LE', data);
            expect(result).toEqual(0);
        });
    });
    describe('unpackBool', () => {
        test('unpacks a bool', () => {
            const data = Buffer.from([0x01]);
            const result = unpackBool('BE', data);
            expect(result).toEqual(true);
        });
    });
    describe('unpackLengthShort', () => {
        test('unpacks a length short in big endian', () => {
            const data = Buffer.from([0x01, 0x02]);
            const result = unpackLengthShort('BE', data);
            expect(result).toEqual(0x0102);
        });
        test('unpacks a length short in little endian', () => {
            const data = Buffer.from([0x01, 0x02]);
            const result = unpackLengthShort('LE', data);
            expect(result).toEqual(0x0201);
        });
    });
    describe('unpackStringVar', () => {
        test('unpacks a string var', () => {
            const data = Buffer.from([0x31, 0x32, 0x33, 0x34, 0x35]);
            const result = unpackStringVar('BE', data, 4);
            expect(result).toEqual('1234');
        });
        test('throws an error if no length is provided', () => {
            const data = Buffer.from([0x01, 0x02, 0x03, 0x04]);
            expect(() => unpackStringVar('BE', data)).toThrow('Length must be provided for variable length string');
        });
    });
    describe('unpackStringFixed', () => {
        test('unpacks a string fixed', () => {
            const data = Buffer.from([0x31, 0x32, 0x33, 0x34, 0x35]);
            const result = unpackStringFixed('BE', data, 3);
            expect(result).toEqual('123');
        });
        test('throws an error if no length is provided', () => {
            const data = Buffer.from([0x01, 0x02, 0x03, 0x04]);
            expect(() => unpackStringFixed('BE', data)).toThrow('Length must be provided for fixed length string');
        });
    });
});
