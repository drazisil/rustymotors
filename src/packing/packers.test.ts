import { describe, test, expect } from "vitest";
import { packShort, packByte, packLong, packBlob, packFloat, packBool, packLengthShort, packStringVar, packStringFixed } from "./packers.js";

describe("packShort", () => {
    test("packs a short in LE", () => {
        const buffer = packShort("LE", 0x1234);
        expect(buffer.toString("hex")).toBe("3412");
    });
    test("packs a short in BE", () => {
        const buffer = packShort("BE", 0x1234);
        expect(buffer.toString("hex")).toBe("1234");
    });
    test("throws an error if data is not a number", () => {
        expect(() => packShort("LE", "not a number")).toThrow();
    });
});

describe("packByte", () => {
    test("packs a byte in LE", () => {
        const buffer = packByte("LE", 0x12);
        expect(buffer.toString("hex")).toBe("12");
    });
    test("packs a byte in BE", () => {
        const buffer = packByte("BE", 0x12);
        expect(buffer.toString("hex")).toBe("12");
    });
    test("throws an error if data is not a number", () => {
        expect(() => packByte("LE", "not a number")).toThrow();
    });
});

describe("packLong", () => {
    test("packs a long in LE", () => {
        const buffer = packLong("LE", 0x12345678);
        expect(buffer.toString("hex")).toBe("78563412");
    });
    test("packs a long in BE", () => {
        const buffer = packLong("BE", 0x12345678);
        expect(buffer.toString("hex")).toBe("12345678");
    });
    test("throws an error if data is not a number", () => {
        expect(() => packLong("LE", "not a number")).toThrow();
    });
});

describe("packBlob", () => {
    test("packs a blob in LE", () => {
        const buffer = packBlob("LE", Buffer.from([0x12, 0x34, 0x56, 0x78]), 2);
        expect(buffer.toString("hex")).toBe("02001234");
    });
    test("packs a blob in BE", () => {
        const buffer = packBlob("BE", Buffer.from([0x12, 0x34, 0x56, 0x78]), 2);
        expect(buffer.toString("hex")).toBe("00021234");
    });
    test("throws an error if data is not a number", () => {
        expect(() => packBlob("LE", "not a number", 4)).toThrow();
    });
});

describe("packFloat", () => {
    test("packs a float in LE", () => {
        const buffer = packFloat("LE", 0xcafebabe);
        expect(buffer.toString("hex")).toBe("bbfe4a4f");
    });
    test("packs a float in BE", () => {
        const buffer = packFloat("BE", 0xcafebabe);
        expect(buffer.toString("hex")).toBe("4f4afebb");
    });
    test("throws an error if data is not a number", () => {
        expect(() => packFloat("LE", "not a number")).toThrow();
    });
});

describe("packBool", () => {
    test("packs a bool in LE", () => {
        const buffer = packBool("LE", true);
        expect(buffer).toStrictEqual(Buffer.from([0x01, 0x00]));
    });
    test("packs a bool in BE", () => {
        const buffer = packBool("BE", true);
        expect(buffer).toStrictEqual(Buffer.from([0x00, 0x01]));
    });
    test("throws an error if data is not a number", () => {
        expect(() => packBool("LE", "not a number")).toThrow();
    });
});

describe("packLengthShort", () => {
    test("packs a length short in LE", () => {
        const buffer = packLengthShort("LE", 0x1234);
        expect(buffer.toString("hex")).toBe("3412");
    });
    test("packs a length short in BE", () => {
        const buffer = packLengthShort("BE", 0x1234);
        expect(buffer.toString("hex")).toBe("1234");
    });
    test("throws an error if data is not a number", () => {
        expect(() => packLengthShort("LE", "not a number")).toThrow();
    });
});

describe("packStringVar", () => {
    test("packs a string var in LE", () => {
                // Arrange
                const expected = Buffer.from([0x02, 0x00, 116, 101]);

        const buffer = packStringVar("LE", "test", 2);
        expect(buffer).toStrictEqual(expected);
    });
    test("packs a string var in BE", () => {
        // Arrange
        const expected = Buffer.from([0x00, 0x02, 116, 101]);

        const buffer = packStringVar("BE", "test", 2);
        expect(buffer).toStrictEqual(expected);
    });
    test("throws an error if data is not a number", () => {
        expect(() => packStringVar("LE", 89, 2)).toThrow();
    });
});

describe("packStringFixed", () => {
    test("packs a string fixed in LE", () => {
        const buffer = packStringFixed("LE", "test", 3);
        expect(buffer).toStrictEqual(Buffer.from("tes"));
    });
    test("packs a string fixed in BE", () => {
        const buffer = packStringFixed("BE", "test", 2);
        expect(buffer).toStrictEqual(Buffer.from("te"));
    });
    test("throws an error if data is not a string", () => {
        expect(() => packStringFixed("LE", 87, 2)).toThrow();
    });
});


