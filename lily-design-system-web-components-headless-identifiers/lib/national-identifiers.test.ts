import { describe, expect, test } from "vitest";

import {
    isCalendarDate,
    luhnValid,
    stripSeparators,
    validateAustraliaTaxFileNumber,
    validateBelgiqueRegistreNational,
    validateBharatAadhaar,
    validateCanadaSocialInsuranceNumber,
    validateFranceNir,
    validateNederlandBurgerservicenummer,
    validateNhsNumber,
    validatePolskaPesel,
    validateSchweizAhvNummer,
    validateSverigePersonnummer,
    validateTurkiyeTcKimlikNumarasi,
    verhoeffValid,
} from "./national-identifiers";

const ok = { valid: true };
const bad = (reason: string) => ({ valid: false, reason });

describe("primitives", () => {
    test("stripSeparators removes space, dot, dash and slash only", () => {
        expect(stripSeparators("943 476-5919.x/y")).toBe("9434765919xy");
    });

    test("luhnValid", () => {
        expect(luhnValid("79927398713")).toBe(true);
        expect(luhnValid("79927398710")).toBe(false);
        expect(luhnValid("")).toBe(false);
        expect(luhnValid("7992739871a")).toBe(false);
    });

    test("verhoeffValid (the worked example 236 gives check digit 3)", () => {
        expect(verhoeffValid("2363")).toBe(true);
        expect(verhoeffValid("2364")).toBe(false);
        expect(verhoeffValid("23x3")).toBe(false);
    });

    test("isCalendarDate", () => {
        expect(isCalendarDate(2024, 2, 29)).toBe(true);
        expect(isCalendarDate(2023, 2, 29)).toBe(false);
        expect(isCalendarDate(1900, 2, 29)).toBe(false);
        expect(isCalendarDate(2000, 2, 29)).toBe(true);
        expect(isCalendarDate(2024, 13, 1)).toBe(false);
        expect(isCalendarDate(2024, 4, 31)).toBe(false);
        expect(isCalendarDate(2024, 1, 0)).toBe(false);
        expect(isCalendarDate(2024.5, 1, 1)).toBe(false);
    });
});

describe("every validator refuses a value that is not a string", () => {
    test.each([
        validateNhsNumber,
        validateCanadaSocialInsuranceNumber,
        validateNederlandBurgerservicenummer,
        validateBelgiqueRegistreNational,
        validateSverigePersonnummer,
        validatePolskaPesel,
        validateAustraliaTaxFileNumber,
        validateBharatAadhaar,
        validateSchweizAhvNummer,
        validateFranceNir,
        validateTurkiyeTcKimlikNumarasi,
    ])("%o", (validate) => {
        expect(() => validate(9434765919 as unknown as string)).toThrow(TypeError);
        expect(() => validate(undefined as unknown as string)).toThrow(TypeError);
    });
});

describe("validateNhsNumber", () => {
    test("a worked example, with and without spaces", () => {
        expect(validateNhsNumber("943 476 5919")).toEqual(ok);
        expect(validateNhsNumber("9434765919")).toEqual(ok);
    });
    test("a check digit of 0 (remainder 0) and one of 9", () => {
        expect(validateNhsNumber("943 476 5900")).toEqual(ok);
        expect(validateNhsNumber("999 999 9999")).toEqual(ok);
    });
    test("a wrong check digit, a check that would be 10, a wrong length and bad characters", () => {
        expect(validateNhsNumber("943 476 5918")).toEqual(bad("checksum"));
        expect(validateNhsNumber("943 476 5960")).toEqual(bad("checksum"));
        expect(validateNhsNumber("943 476 591")).toEqual(bad("length"));
        expect(validateNhsNumber("943 476 59190")).toEqual(bad("length"));
        expect(validateNhsNumber("943 476 591X")).toEqual(bad("characters"));
        expect(validateNhsNumber("")).toEqual(bad("characters"));
    });
});

describe("validateCanadaSocialInsuranceNumber", () => {
    test("the standard worked example", () => {
        expect(validateCanadaSocialInsuranceNumber("046 454 286")).toEqual(ok);
    });
    test("a failed Luhn check, length and characters", () => {
        expect(validateCanadaSocialInsuranceNumber("046 454 287")).toEqual(bad("checksum"));
        expect(validateCanadaSocialInsuranceNumber("046 454 28")).toEqual(bad("length"));
        expect(validateCanadaSocialInsuranceNumber("046 454 28A")).toEqual(bad("characters"));
    });
});

describe("validateNederlandBurgerservicenummer", () => {
    test("the worked example 111222333", () => {
        expect(validateNederlandBurgerservicenummer("111222333")).toEqual(ok);
    });
    test("fails the 11-proof, all zeros, length, characters", () => {
        expect(validateNederlandBurgerservicenummer("111222334")).toEqual(bad("checksum"));
        expect(validateNederlandBurgerservicenummer("000000000")).toEqual(bad("checksum"));
        expect(validateNederlandBurgerservicenummer("11122233")).toEqual(bad("length"));
        expect(validateNederlandBurgerservicenummer("11122233a")).toEqual(bad("characters"));
    });
});

describe("validateBelgiqueRegistreNational", () => {
    test("a number born before 2000 and one born after", () => {
        expect(validateBelgiqueRegistreNational("85.07.30-033.28")).toEqual(ok);
        // 2000 or later: the check is taken with a leading 2 on the nine digits.
        const base = 10_101_001; // 010101001
        const check = String(97 - ((2_000_000_000 + base) % 97)).padStart(2, "0");
        expect(validateBelgiqueRegistreNational(`010101001${check}`)).toEqual(ok);
    });
    test("a wrong key, an unreal date, an impossible serial, length and characters", () => {
        expect(validateBelgiqueRegistreNational("85.07.30-033.29")).toEqual(bad("checksum"));
        expect(validateBelgiqueRegistreNational("85.19.30-033.28")).toEqual(bad("date"));
        expect(validateBelgiqueRegistreNational("85.07.32-033.28")).toEqual(bad("date"));
        expect(validateBelgiqueRegistreNational("85.07.30-000.28")).toEqual(bad("structure"));
        expect(validateBelgiqueRegistreNational("85.07.30-033.2")).toEqual(bad("length"));
        expect(validateBelgiqueRegistreNational("85.07.30-033.2x")).toEqual(bad("characters"));
    });
});

describe("validateSverigePersonnummer", () => {
    test("ten and twelve digit forms of one number", () => {
        expect(validateSverigePersonnummer("811228-9874")).toEqual(ok);
        expect(validateSverigePersonnummer("19811228-9874")).toEqual(ok);
        expect(validateSverigePersonnummer("198112289874")).toEqual(ok);
    });
    test("a samordningsnummer adds 60 to the day", () => {
        const stem = "811288987";
        const body = stem + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].find((c) => luhnValid(stem + c));
        expect(body).toHaveLength(10);
        expect(validateSverigePersonnummer(body)).toEqual(ok);
        expect(validateSverigePersonnummer(`1981${body.slice(2)}`)).toEqual(ok);
        // 28 + 60 = 88 is only a real day in the twelve-digit form when 28 is: 31 February + 60 is not.
        expect(validateSverigePersonnummer("198102909874")).toEqual(bad("date"));
    });
    test("a failed Luhn check, an unreal date, length and characters", () => {
        expect(validateSverigePersonnummer("811228-9875")).toEqual(bad("checksum"));
        expect(validateSverigePersonnummer("19810230-9874")).toEqual(bad("date"));
        expect(validateSverigePersonnummer("811228-987")).toEqual(bad("length"));
        expect(validateSverigePersonnummer("81122x-9874")).toEqual(bad("characters"));
    });
});

describe("validatePolskaPesel", () => {
    test("the worked example 44051401359", () => {
        expect(validatePolskaPesel("44051401359")).toEqual(ok);
    });
    test("a wrong check digit, a month field that is not a date, length and characters", () => {
        expect(validatePolskaPesel("44051401358")).toEqual(bad("checksum"));
        expect(validatePolskaPesel("44131401359")).toEqual(bad("date"));
        expect(validatePolskaPesel("4405140135")).toEqual(bad("length"));
        expect(validatePolskaPesel("4405140135a")).toEqual(bad("characters"));
    });
});

describe("validateAustraliaTaxFileNumber", () => {
    test("the worked example 123 456 782", () => {
        expect(validateAustraliaTaxFileNumber("123 456 782")).toEqual(ok);
    });
    test("a failed check, length and characters", () => {
        expect(validateAustraliaTaxFileNumber("123 456 783")).toEqual(bad("checksum"));
        expect(validateAustraliaTaxFileNumber("123 456 78")).toEqual(bad("length"));
        expect(validateAustraliaTaxFileNumber("123 456 78x")).toEqual(bad("characters"));
    });
});

describe("validateBharatAadhaar", () => {
    const withCheck = (body: string) => {
        for (let c = 0; c < 10; c++) if (verhoeffValid(body + c)) return body + c;
        throw new Error("no check digit");
    };
    test("a number with a valid Verhoeff check", () => {
        expect(validateBharatAadhaar(withCheck("23456789012"))).toEqual(ok);
        expect(validateBharatAadhaar(withCheck("23456789012").replace(/(\d{4})/g, "$1 "))).toEqual(
            ok,
        );
    });
    test("a failed check, a first digit of 0 or 1, length and characters", () => {
        const good = withCheck("23456789012");
        const wrong = good.slice(0, 11) + String((Number(good[11]) + 1) % 10);
        expect(validateBharatAadhaar(wrong)).toEqual(bad("checksum"));
        expect(validateBharatAadhaar(withCheck("03456789012"))).toEqual(bad("structure"));
        expect(validateBharatAadhaar(withCheck("13456789012"))).toEqual(bad("structure"));
        expect(validateBharatAadhaar("2345678901")).toEqual(bad("length"));
        expect(validateBharatAadhaar("23456789012x")).toEqual(bad("characters"));
    });
});

describe("validateSchweizAhvNummer", () => {
    test("the worked example 756.9217.0769.85", () => {
        expect(validateSchweizAhvNummer("756.9217.0769.85")).toEqual(ok);
    });
    test("a failed check, a prefix other than 756, length and characters", () => {
        expect(validateSchweizAhvNummer("756.9217.0769.84")).toEqual(bad("checksum"));
        expect(validateSchweizAhvNummer("757.9217.0769.85")).toEqual(bad("structure"));
        expect(validateSchweizAhvNummer("756.9217.0769.8")).toEqual(bad("length"));
        expect(validateSchweizAhvNummer("756.9217.0769.8x")).toEqual(bad("characters"));
    });
});

describe("validateFranceNir", () => {
    const withKey = (body: string) => {
        const n = body.replace("2A", "19").replace("2B", "18");
        let r = 0;
        for (const c of n) r = (r * 10 + Number(c)) % 97;
        return body + String(97 - r).padStart(2, "0");
    };
    test("a metropolitan number and both Corsican departments", () => {
        expect(validateFranceNir(withKey("1850775123456"))).toEqual(ok);
        const corsica = withKey("185072A123456");
        expect(validateFranceNir(corsica)).toEqual(ok);
        expect(validateFranceNir(corsica.toLowerCase())).toEqual(ok);
        expect(validateFranceNir(withKey("185072B123456"))).toEqual(ok);
        expect(validateFranceNir(corsica.replace(/^(\d)(\d\d)(\d\d)/, "$1 $2 $3 "))).toEqual(ok);
    });
    test("a wrong key, a malformed body, length and characters", () => {
        const good = withKey("1850775123456");
        const wrongKey = String((Number(good.slice(13)) % 97) + 1).padStart(2, "0");
        expect(validateFranceNir(good.slice(0, 13) + wrongKey)).toEqual(bad("checksum"));
        expect(validateFranceNir("185072C12345600")).toEqual(bad("characters"));
        expect(validateFranceNir("1850775123456")).toEqual(bad("length"));
        expect(validateFranceNir("18507A5123456" + "00")).toEqual(bad("structure"));
        expect(validateFranceNir("1850775123456x1")).toEqual(bad("characters"));
    });
});

describe("validateTurkiyeTcKimlikNumarasi", () => {
    const build = (first9: string) => {
        const d = [...first9].map(Number);
        const tenth =
            ((((d[0] + d[2] + d[4] + d[6] + d[8]) * 7 - (d[1] + d[3] + d[5] + d[7])) % 10) + 10) %
            10;
        const eleventh = (d.reduce((a, b) => a + b, 0) + tenth) % 10;
        return first9 + tenth + eleventh;
    };
    test("a number with both check digits", () => {
        expect(validateTurkiyeTcKimlikNumarasi(build("123456789"))).toEqual(ok);
    });
    test("a failed first or second check, a leading zero, length and characters", () => {
        const good = build("123456789");
        const flip = (i: number) =>
            good.slice(0, i) + String((Number(good[i]) + 1) % 10) + good.slice(i + 1);
        expect(validateTurkiyeTcKimlikNumarasi(flip(9))).toEqual(bad("checksum"));
        expect(validateTurkiyeTcKimlikNumarasi(flip(10))).toEqual(bad("checksum"));
        expect(validateTurkiyeTcKimlikNumarasi(build("023456789"))).toEqual(bad("structure"));
        expect(validateTurkiyeTcKimlikNumarasi("1234567890")).toEqual(bad("length"));
        expect(validateTurkiyeTcKimlikNumarasi("1234567890x")).toEqual(bad("characters"));
    });
});
