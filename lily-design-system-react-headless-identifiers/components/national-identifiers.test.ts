import { describe, expect, test } from "vitest";

import {
    isCalendarDate,
    luhnValid,
    stripSeparators,
    validateAustraliaTaxFileNumber,
    validateDanmarkPersonnummer,
    validateEspanaCodigoDeIdentificacionFiscal,
    validateIndonesiaNomorIndukKependudukan,
    validateMalaysiaKadPengenalan,
    validateAsSaudiyahRaqmAlHuwiyahAlWataniyah,
    validateAustraliaIndividualHealthcareIdentifier,
    validateDeutschlandKrankenversichertennummer,
    validatePolskaNumerIdentyfikacjiPodatkowej,
    validateQazaqstanZhekeSaikestendiruNomiri,
    validateUkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkiv,
    validateUnitedKingdomNationalInsuranceNumber,
    validateUnitedStatesSocialSecurityNumber,
    validateAlImaratRaqmAlHuwiyah,
    validateHongKongIdentityCard,
    validateHrvatskaOsobniIdentifikacijskiBroj,
    validateIranKodEMelli,
    validateIslandKennitala,
    validateOsterreichSozialversicherungsnummer,
    validatePrathetThaiLekPrajamTuaPrachachon,
    validateRomaniaCodNumericPersonal,
    validateSlovenijaEmso,
    validateYisraelTeudatZehut,
    validateArgentinaCodigoUnicoDeIdentificacionLaboral,
    validateChileRolUnicoNacional,
    validateEcuadorCedulaDeIdentidad,
    validateLatvijaPersonasKods,
    validateLietuvaAsmensKodas,
    validateMexicoClaveUnicaDeRegistroDePoblacion,
    validateNihonKojinBango,
    validatePortugalNumeroDeIdentificacaoFiscal,
    validateSingaporeNationalRegistrationIdentityCard,
    validateSouthAfricaIdentityNumber,
    validateTaiwanGuominShenfenzhengTongyiBianhao,
    validateUruguayCedulaDeIdentidad,
    validateZhongguoJuminShenfenzhengHaoma,
    validateBulgariaEdinenGrazhdanskiNomer,
    validateEestiIsikukood,
    validateItaliaCodiceFiscale,
    validateMagyarorszagTajSzam,
    validateNorgeFodselsnummer,
    validateRodneCislo,
    validateRossiyaSnils,
    validateSuomiHenkilotunnus,
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

describe("validateBulgariaEdinenGrazhdanskiNomer", () => {
    test("a worked example, and a remainder of 10 giving a check of 0", () => {
        expect(validateBulgariaEdinenGrazhdanskiNomer("8032056031")).toEqual(ok);
        // A remainder of 10 gives a check of 0: search the serials of one day for a stem that has one.
        const weights = [2, 4, 8, 5, 10, 9, 7, 3, 6];
        const stem = [...Array(1000).keys()]
            .map((n) => "803205" + String(n).padStart(3, "0"))
            .find(
                (t) => [...t].reduce((sum, c, k) => sum + Number(c) * weights[k], 0) % 11 === 10,
            )!;
        expect(validateBulgariaEdinenGrazhdanskiNomer(stem + "0")).toEqual(ok);
        expect(validateBulgariaEdinenGrazhdanskiNomer(stem + "1")).toEqual(bad("checksum"));
    });
    test("a failed check, an unreal date, length and characters", () => {
        expect(validateBulgariaEdinenGrazhdanskiNomer("8032056032")).toEqual(bad("checksum"));
        expect(validateBulgariaEdinenGrazhdanskiNomer("8013326031")).toEqual(bad("date"));
        expect(validateBulgariaEdinenGrazhdanskiNomer("803205603")).toEqual(bad("length"));
        expect(validateBulgariaEdinenGrazhdanskiNomer("803205603x")).toEqual(bad("characters"));
    });
});

describe("validateNorgeFodselsnummer", () => {
    const withChecks = (nine: string) => {
        const d = [...nine].map(Number);
        const k = (weights: number[], digits: number[]) => {
            const r = 11 - (digits.reduce((t, n, i) => t + n * weights[i], 0) % 11);
            return r === 11 ? 0 : r;
        };
        const k1 = k([3, 7, 6, 1, 8, 9, 4, 5, 2], d);
        const k2 = k([5, 4, 3, 2, 7, 6, 5, 4, 3, 2], [...d, k1]);
        return k1 === 10 || k2 === 10 ? undefined : nine + k1 + k2;
    };
    test("numbers born in each century, a D-number and an H-number", () => {
        // Find the first serial that does not give a check of 10.
        const make = (ddmmyy: string, from: number) => {
            for (let n = from; n < from + 50; n++) {
                const v = withChecks(ddmmyy + String(n).padStart(3, "0"));
                if (v) return v;
            }
            throw new Error("none");
        };
        expect(validateNorgeFodselsnummer(make("010185", 100))).toEqual(ok);
        expect(validateNorgeFodselsnummer(make("010100", 500))).toEqual(ok);
        expect(validateNorgeFodselsnummer(make("010160", 500))).toEqual(ok);
        expect(validateNorgeFodselsnummer(make("410185", 100))).toEqual(ok);
        expect(validateNorgeFodselsnummer(make("014185", 100))).toEqual(ok);
    });
    test("a failed check, an unreal date, a check of 10, length and characters", () => {
        const good = withChecks("010185100") ?? withChecks("010185101")!;
        const wrong = good.slice(0, 10) + String((Number(good[10]) + 1) % 10);
        expect(validateNorgeFodselsnummer(wrong)).toEqual(bad("checksum"));
        expect(validateNorgeFodselsnummer("3102851000" + "0")).toEqual(bad("date"));
        expect(validateNorgeFodselsnummer("0101851000")).toEqual(bad("length"));
        expect(validateNorgeFodselsnummer("0101851000x")).toEqual(bad("characters"));
    });
});

describe("validateEestiIsikukood", () => {
    test("a worked example", () => {
        expect(validateEestiIsikukood("37605030299")).toEqual(ok);
    });
    test("the second weights, and 0 when both give 10", () => {
        const check = (nine: string) => {
            const d = [...nine].map(Number);
            let c = d.reduce((t, n, i) => t + n * [1, 2, 3, 4, 5, 6, 7, 8, 9, 1][i], 0) % 11;
            if (c === 10) {
                c = d.reduce((t, n, i) => t + n * [3, 4, 5, 6, 7, 8, 9, 1, 2, 3][i], 0) % 11;
                if (c === 10) c = 0;
            }
            return c;
        };
        // 1 + serial digits chosen so the first pass gives 10, found by search.
        let found = 0;
        for (let serial = 0; serial < 1000 && found < 2; serial++) {
            const body = "3760503" + String(serial).padStart(3, "0");
            const d = [...body].map(Number);
            const first = d.reduce((t, n, i) => t + n * [1, 2, 3, 4, 5, 6, 7, 8, 9, 1][i], 0) % 11;
            if (first === 10) {
                expect(validateEestiIsikukood(body + check(body))).toEqual(ok);
                found++;
            }
        }
        expect(found).toBeGreaterThan(0);
    });
    test("a failed check, a century digit of 0 or 9, an unreal date, length and characters", () => {
        expect(validateEestiIsikukood("37605030298")).toEqual(bad("checksum"));
        expect(validateEestiIsikukood("07605030299")).toEqual(bad("structure"));
        expect(validateEestiIsikukood("97605030299")).toEqual(bad("structure"));
        expect(validateEestiIsikukood("37613030299")).toEqual(bad("date"));
        expect(validateEestiIsikukood("3760503029")).toEqual(bad("length"));
        expect(validateEestiIsikukood("3760503029x")).toEqual(bad("characters"));
    });
});

describe("validateRodneCislo", () => {
    test("a ten digit number, a woman's month, a month with 20 added, and a nine digit number before 1954", () => {
        expect(validateRodneCislo("710319/2745")).toEqual(ok);
        expect(validateRodneCislo("7153190006".slice(0, 9) + "x")).toEqual(bad("characters"));
        expect(validateRodneCislo("535319/123")).toEqual(ok);
    });
    test("a first nine digits with remainder 10 and a last digit of 0", () => {
        // 1 January 1970, serials 000 to 999: one of them leaves a remainder of 10.
        const n = [...Array(1000).keys()].map((i) => 700101000 + i).find((n) => n % 11 === 10)!;
        expect(validateRodneCislo(`${n}0`)).toEqual(ok);
        expect(validateRodneCislo(`${n}1`)).toEqual(bad("checksum"));
    });
    test("a failed check, an unreal date, a nine digit number after 1954, length and characters", () => {
        expect(validateRodneCislo("710319/2746")).toEqual(bad("checksum"));
        expect(validateRodneCislo("711319/2745")).toEqual(bad("date"));
        expect(validateRodneCislo("710319/123")).toEqual(bad("structure"));
        expect(validateRodneCislo("71031927")).toEqual(bad("length"));
    });
});

describe("validateMagyarorszagTajSzam", () => {
    test("a worked example", () => {
        // 1*3 + 2*7 + 3*3 + 4*7 + 5*3 + 6*7 + 7*3 + 8*7 = 188, so the check digit is 8.
        expect(validateMagyarorszagTajSzam("123 456 788")).toEqual(ok);
    });
    test("a failed check, length and characters", () => {
        expect(validateMagyarorszagTajSzam("123 456 789")).toEqual(bad("checksum"));
        expect(validateMagyarorszagTajSzam("123 456 78")).toEqual(bad("length"));
        expect(validateMagyarorszagTajSzam("123 456 78x")).toEqual(bad("characters"));
    });
});

describe("validateRossiyaSnils", () => {
    const sumOf = (stem: string) => [...stem].reduce((t, c, k) => t + Number(c) * (9 - k), 0);
    const stemWith = (wanted: (sum: number) => boolean, prefix = "9999") => {
        for (let i = 0; i < 100000; i++) {
            const stem = prefix + String(i).padStart(9 - prefix.length, "0");
            if (wanted(sumOf(stem))) return stem;
        }
        throw new Error("no stem");
    };

    test("the worked example 112-233-445 95", () => {
        expect(validateRossiyaSnils("112-233-445 95")).toEqual(ok);
        expect(validateRossiyaSnils("11223344595")).toEqual(ok);
    });

    test("a sum over 101 gives the sum modulo 101, and 100 or 101 or a remainder of 100 give 00", () => {
        const over = stemWith((sum) => sum > 101 && sum % 101 !== 100 && sum % 101 !== 0);
        expect(validateRossiyaSnils(over + String(sumOf(over) % 101).padStart(2, "0"))).toEqual(ok);
        expect(validateRossiyaSnils(stemWith((sum) => sum === 100, "0000") + "00")).toEqual(ok);
        expect(validateRossiyaSnils(stemWith((sum) => sum === 101, "0000") + "00")).toEqual(ok);
        expect(
            validateRossiyaSnils(stemWith((sum) => sum > 101 && sum % 101 === 100) + "00"),
        ).toEqual(ok);
    });

    test("a failed check, length and characters", () => {
        expect(validateRossiyaSnils("112-233-445 96")).toEqual(bad("checksum"));
        expect(validateRossiyaSnils("112-233-445 9")).toEqual(bad("length"));
        expect(validateRossiyaSnils("112-233-445 9x")).toEqual(bad("characters"));
    });
});

describe("validateSuomiHenkilotunnus", () => {
    test("a worked example, and a century sign of A", () => {
        expect(validateSuomiHenkilotunnus("131052-308T")).toEqual(ok);
        const n = 10106123;
        expect(
            validateSuomiHenkilotunnus(`010106A123${"0123456789ABCDEFHJKLMNPRSTUVWXY"[n % 31]}`),
        ).toEqual(ok);
        expect(
            validateSuomiHenkilotunnus(
                `010180+123${"0123456789ABCDEFHJKLMNPRSTUVWXY"[10180123 % 31]}`,
            ),
        ).toEqual(ok);
    });
    test("a failed check, an unreal date, a serial out of range, length and characters", () => {
        expect(validateSuomiHenkilotunnus("131052-308U")).toEqual(bad("checksum"));
        expect(validateSuomiHenkilotunnus("311152-308T")).toEqual(bad("date"));
        expect(validateSuomiHenkilotunnus("131052-001T")).toEqual(bad("structure"));
        expect(validateSuomiHenkilotunnus("131052-308")).toEqual(bad("length"));
        expect(validateSuomiHenkilotunnus("131052x308T")).toEqual(bad("characters"));
        expect(validateSuomiHenkilotunnus("131052-308t")).toEqual(bad("characters"));
    });
});

describe("validateItaliaCodiceFiscale", () => {
    test("a worked example, and an omocodia number", () => {
        expect(validateItaliaCodiceFiscale("RSSMRA85T10A562S")).toEqual(ok);
        expect(validateItaliaCodiceFiscale("RSSMRA85T10A562S".replace(/ /g, ""))).toEqual(ok);
    });
    test("a failed check, a month letter that is not one, an unreal day, structure, length and characters", () => {
        expect(validateItaliaCodiceFiscale("RSSMRA85T10A562T")).toEqual(bad("checksum"));
        expect(validateItaliaCodiceFiscale("RSSMRA85F10A562S")).toEqual(bad("date"));
        expect(validateItaliaCodiceFiscale("RSSMRA85T32A562S")).toEqual(bad("date"));
        expect(validateItaliaCodiceFiscale("1SSMRA85T10A562S")).toEqual(bad("structure"));
        expect(validateItaliaCodiceFiscale("RSSMRA85T10A562")).toEqual(bad("length"));
        expect(validateItaliaCodiceFiscale("rssmra85t10a562s")).toEqual(bad("characters"));
    });
});

describe("validatePortugalNumeroDeIdentificacaoFiscal", () => {
    test("a worked example, and a check of 0 where 11 minus the remainder is 10 or 11", () => {
        expect(validatePortugalNumeroDeIdentificacaoFiscal("123456789")).toEqual(ok);
        const weights = [9, 8, 7, 6, 5, 4, 3, 2];
        const stem = [...Array(1000).keys()]
            .map((n) => "50000" + String(n).padStart(3, "0"))
            .find(
                (t) =>
                    11 - ([...t].reduce((sum, c, k) => sum + Number(c) * weights[k], 0) % 11) >= 10,
            )!;
        expect(validatePortugalNumeroDeIdentificacaoFiscal(stem + "0")).toEqual(ok);
        expect(validatePortugalNumeroDeIdentificacaoFiscal(stem + "1")).toEqual(bad("checksum"));
    });
    test("a failed check, length and characters", () => {
        expect(validatePortugalNumeroDeIdentificacaoFiscal("123456788")).toEqual(bad("checksum"));
        expect(validatePortugalNumeroDeIdentificacaoFiscal("12345678")).toEqual(bad("length"));
        expect(validatePortugalNumeroDeIdentificacaoFiscal("12345678x")).toEqual(bad("characters"));
    });
});

describe("validateChileRolUnicoNacional", () => {
    const dv = (body: string) => {
        const sum = [...body].reverse().reduce((t, c, i) => t + Number(c) * (2 + (i % 6)), 0);
        const check = 11 - (sum % 11);
        return check === 11 ? "0" : check === 10 ? "K" : String(check);
    };
    test("a worked example, a check of K and a check of 0", () => {
        expect(validateChileRolUnicoNacional("12.345.678-5")).toEqual(ok);
        const k = [...Array(1000).keys()]
            .map((n) => String(10000000 + n))
            .find((b) => dv(b) === "K")!;
        const zero = [...Array(1000).keys()]
            .map((n) => String(10000000 + n))
            .find((b) => dv(b) === "0")!;
        expect(validateChileRolUnicoNacional(`${k}-K`)).toEqual(ok);
        expect(validateChileRolUnicoNacional(`${zero}-0`)).toEqual(ok);
        expect(validateChileRolUnicoNacional(`${k}-0`)).toEqual(bad("checksum"));
    });
    test("a failed check, length and characters", () => {
        expect(validateChileRolUnicoNacional("12.345.678-4")).toEqual(bad("checksum"));
        expect(validateChileRolUnicoNacional("5")).toEqual(bad("length"));
        expect(validateChileRolUnicoNacional("12.345.678-k")).toEqual(bad("characters"));
    });
});

describe("validateUruguayCedulaDeIdentidad", () => {
    test("a worked example, and a six digit body", () => {
        expect(validateUruguayCedulaDeIdentidad("1.234.567-2")).toEqual(ok);
        const weights = [2, 9, 8, 7, 6, 3, 4];
        const body = "0123456";
        const check =
            (10 - ([...body].reduce((t, c, k) => t + Number(c) * weights[k], 0) % 10)) % 10;
        expect(validateUruguayCedulaDeIdentidad(`${body.slice(1)}-${check}`)).toEqual(ok);
    });
    test("a failed check, length and characters", () => {
        expect(validateUruguayCedulaDeIdentidad("1.234.567-3")).toEqual(bad("checksum"));
        expect(validateUruguayCedulaDeIdentidad("1.234.56")).toEqual(bad("length"));
        expect(validateUruguayCedulaDeIdentidad("1.234.56x-2")).toEqual(bad("characters"));
    });
});

describe("validateEcuadorCedulaDeIdentidad", () => {
    test("a worked example", () => {
        expect(validateEcuadorCedulaDeIdentidad("1710034065")).toEqual(ok);
    });
    test("a failed check, an unknown province, a third digit of 6, length and characters", () => {
        expect(validateEcuadorCedulaDeIdentidad("1710034066")).toEqual(bad("checksum"));
        expect(validateEcuadorCedulaDeIdentidad("9910034065")).toEqual(bad("structure"));
        expect(validateEcuadorCedulaDeIdentidad("1760034065")).toEqual(bad("structure"));
        expect(validateEcuadorCedulaDeIdentidad("171003406")).toEqual(bad("length"));
        expect(validateEcuadorCedulaDeIdentidad("171003406x")).toEqual(bad("characters"));
    });
});

describe("validateArgentinaCodigoUnicoDeIdentificacionLaboral", () => {
    const remainderOf = (body: string) =>
        [...body].reduce((t, c, i) => t + Number(c) * [5, 4, 3, 2, 7, 6, 5, 4, 3, 2][i], 0) % 11;
    test("a worked example, and a remainder of 0 giving a check of 0", () => {
        expect(validateArgentinaCodigoUnicoDeIdentificacionLaboral("20-12345678-6")).toEqual(ok);
        const stem = [...Array(1000).keys()]
            .map((n) => "2000000" + String(n).padStart(3, "0"))
            .find((b) => remainderOf(b) === 0)!;
        expect(validateArgentinaCodigoUnicoDeIdentificacionLaboral(stem + "0")).toEqual(ok);
    });
    test("a check that would be 10 is never issued", () => {
        const stem = [...Array(1000).keys()]
            .map((n) => "2000000" + String(n).padStart(3, "0"))
            .find((b) => remainderOf(b) === 1)!;
        expect(validateArgentinaCodigoUnicoDeIdentificacionLaboral(stem + "0")).toEqual(
            bad("checksum"),
        );
        expect(validateArgentinaCodigoUnicoDeIdentificacionLaboral(stem + "9")).toEqual(
            bad("checksum"),
        );
    });
    test("a failed check, an unknown prefix, length and characters", () => {
        expect(validateArgentinaCodigoUnicoDeIdentificacionLaboral("20-12345678-7")).toEqual(
            bad("checksum"),
        );
        expect(validateArgentinaCodigoUnicoDeIdentificacionLaboral("21-12345678-6")).toEqual(
            bad("structure"),
        );
        expect(validateArgentinaCodigoUnicoDeIdentificacionLaboral("20-12345678")).toEqual(
            bad("length"),
        );
        expect(validateArgentinaCodigoUnicoDeIdentificacionLaboral("20-12345678-x")).toEqual(
            bad("characters"),
        );
    });
});

describe("validateMexicoClaveUnicaDeRegistroDePoblacion", () => {
    test("a worked example", () => {
        expect(validateMexicoClaveUnicaDeRegistroDePoblacion("HEGG560427MVZRRL04")).toEqual(ok);
    });
    test("a failed check, an unreal date, structure, length and characters", () => {
        expect(validateMexicoClaveUnicaDeRegistroDePoblacion("HEGG560427MVZRRL05")).toEqual(
            bad("checksum"),
        );
        expect(validateMexicoClaveUnicaDeRegistroDePoblacion("HEGG561327MVZRRL04")).toEqual(
            bad("date"),
        );
        expect(validateMexicoClaveUnicaDeRegistroDePoblacion("HEGG560432MVZRRL04")).toEqual(
            bad("date"),
        );
        expect(validateMexicoClaveUnicaDeRegistroDePoblacion("HEGG560427QVZRRL04")).toEqual(
            bad("structure"),
        );
        expect(validateMexicoClaveUnicaDeRegistroDePoblacion("HEGG560427MVZRRL0")).toEqual(
            bad("length"),
        );
        expect(validateMexicoClaveUnicaDeRegistroDePoblacion("hegg560427mvzrrl04")).toEqual(
            bad("characters"),
        );
    });
});

describe("validateSouthAfricaIdentityNumber", () => {
    test("a worked example", () => {
        expect(validateSouthAfricaIdentityNumber("8001015009087")).toEqual(ok);
    });
    test("a failed Luhn check, an unreal date, a citizenship digit of 2, length and characters", () => {
        expect(validateSouthAfricaIdentityNumber("8001015009086")).toEqual(bad("checksum"));
        expect(validateSouthAfricaIdentityNumber("8013015009087")).toEqual(bad("date"));
        const stem = "800101500920";
        const withCheck = stem + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].find((c) => luhnValid(stem + c));
        expect(validateSouthAfricaIdentityNumber(withCheck)).toEqual(bad("structure"));
        expect(validateSouthAfricaIdentityNumber("800101500908")).toEqual(bad("length"));
        expect(validateSouthAfricaIdentityNumber("800101500908x")).toEqual(bad("characters"));
    });
});

describe("validateSingaporeNationalRegistrationIdentityCard", () => {
    test("each prefix", () => {
        expect(validateSingaporeNationalRegistrationIdentityCard("S1234567D")).toEqual(ok);
        expect(validateSingaporeNationalRegistrationIdentityCard("T1234567J")).toEqual(ok);
        expect(validateSingaporeNationalRegistrationIdentityCard("F1234567N")).toEqual(ok);
        expect(validateSingaporeNationalRegistrationIdentityCard("G1234567X")).toEqual(ok);
    });
    test("a failed check, an unknown prefix, length and characters", () => {
        expect(validateSingaporeNationalRegistrationIdentityCard("S1234567E")).toEqual(
            bad("checksum"),
        );
        expect(validateSingaporeNationalRegistrationIdentityCard("A1234567D")).toEqual(
            bad("structure"),
        );
        expect(validateSingaporeNationalRegistrationIdentityCard("S123456D")).toEqual(
            bad("length"),
        );
        expect(validateSingaporeNationalRegistrationIdentityCard("S123456?D")).toEqual(
            bad("characters"),
        );
    });
});

describe("validateTaiwanGuominShenfenzhengTongyiBianhao", () => {
    test("a worked example", () => {
        expect(validateTaiwanGuominShenfenzhengTongyiBianhao("A123456789")).toEqual(ok);
    });
    test("a failed check, a second digit of 3, length and characters", () => {
        expect(validateTaiwanGuominShenfenzhengTongyiBianhao("A123456788")).toEqual(
            bad("checksum"),
        );
        expect(validateTaiwanGuominShenfenzhengTongyiBianhao("A323456789")).toEqual(
            bad("structure"),
        );
        expect(validateTaiwanGuominShenfenzhengTongyiBianhao("A12345678")).toEqual(bad("length"));
        expect(validateTaiwanGuominShenfenzhengTongyiBianhao("A12345678?")).toEqual(
            bad("characters"),
        );
    });
});

describe("validateNihonKojinBango", () => {
    test("a worked example", () => {
        expect(validateNihonKojinBango("123456789018")).toEqual(ok);
        expect(validateNihonKojinBango("1234 5678 9018")).toEqual(ok);
    });
    test("a failed check, length and characters", () => {
        expect(validateNihonKojinBango("123456789019")).toEqual(bad("checksum"));
        expect(validateNihonKojinBango("12345678901")).toEqual(bad("length"));
        expect(validateNihonKojinBango("12345678901x")).toEqual(bad("characters"));
    });
});

describe("validateZhongguoJuminShenfenzhengHaoma", () => {
    test("a worked example with a check of X, and one with a digit", () => {
        expect(validateZhongguoJuminShenfenzhengHaoma("11010519491231002X")).toEqual(ok);
        const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        const stem = "11010519491231000";
        const sum = [...stem].reduce((t, c, k) => t + Number(c) * weights[k], 0);
        expect(validateZhongguoJuminShenfenzhengHaoma(stem + "10X98765432"[sum % 11])).toEqual(ok);
    });
    test("a failed check, an unreal date, length and characters", () => {
        expect(validateZhongguoJuminShenfenzhengHaoma("110105194912310021")).toEqual(
            bad("checksum"),
        );
        expect(validateZhongguoJuminShenfenzhengHaoma("11010519491331002X")).toEqual(bad("date"));
        expect(validateZhongguoJuminShenfenzhengHaoma("11010519491231002")).toEqual(bad("length"));
        expect(validateZhongguoJuminShenfenzhengHaoma("11010519491231002x")).toEqual(
            bad("characters"),
        );
    });
});

describe("validateLatvijaPersonasKods", () => {
    test("an old code with a date and check, and a new code beginning 32", () => {
        expect(validateLatvijaPersonasKods("161175-19997")).toEqual(ok);
        expect(validateLatvijaPersonasKods("32123456789")).toEqual(ok);
    });
    test("a failed check, an unreal date, a century digit of 3, length and characters", () => {
        expect(validateLatvijaPersonasKods("161175-19998")).toEqual(bad("checksum"));
        expect(validateLatvijaPersonasKods("311175-19997")).toEqual(bad("date"));
        expect(validateLatvijaPersonasKods("161175-39997")).toEqual(bad("structure"));
        expect(validateLatvijaPersonasKods("161175-1999")).toEqual(bad("length"));
        expect(validateLatvijaPersonasKods("161175-1999x")).toEqual(bad("characters"));
    });
});

describe("validateLietuvaAsmensKodas", () => {
    const withCheck = (body: string) => {
        const d = [...body].map(Number);
        let c = d.reduce((t, n, i) => t + n * [1, 2, 3, 4, 5, 6, 7, 8, 9, 1][i], 0) % 11;
        if (c === 10) {
            c = d.reduce((t, n, i) => t + n * [3, 4, 5, 6, 7, 8, 9, 1, 2, 3][i], 0) % 11;
            if (c === 10) c = 0;
        }
        return body + c;
    };
    test("numbers of each century", () => {
        expect(validateLietuvaAsmensKodas(withCheck("3900101000"))).toEqual(ok);
        expect(validateLietuvaAsmensKodas(withCheck("5050505000"))).toEqual(ok);
        expect(validateLietuvaAsmensKodas(withCheck("1900101000"))).toEqual(ok);
    });
    test("the second weighting is used when the first check is 10, and a second 10 means 0", () => {
        expect(validateLietuvaAsmensKodas("39001010841")).toEqual(ok);
        expect(validateLietuvaAsmensKodas("39001010590")).toEqual(ok);
    });
    test("a failed check, a century digit of 7, an unreal date, length and characters", () => {
        const good = withCheck("3900101000");
        expect(
            validateLietuvaAsmensKodas(good.slice(0, 10) + String((Number(good[10]) + 1) % 10)),
        ).toEqual(bad("checksum"));
        expect(validateLietuvaAsmensKodas(withCheck("7900101000"))).toEqual(bad("structure"));
        expect(validateLietuvaAsmensKodas(withCheck("3901301000"))).toEqual(bad("date"));
        expect(validateLietuvaAsmensKodas("3900101000")).toEqual(bad("length"));
        expect(validateLietuvaAsmensKodas("3900101000x")).toEqual(bad("characters"));
    });
});

describe("validateHrvatskaOsobniIdentifikacijskiBroj", () => {
    test("a worked example", () => {
        expect(validateHrvatskaOsobniIdentifikacijskiBroj("69435151530")).toEqual(ok);
    });
    test("a failed check, length and characters", () => {
        expect(validateHrvatskaOsobniIdentifikacijskiBroj("69435151531")).toEqual(bad("checksum"));
        expect(validateHrvatskaOsobniIdentifikacijskiBroj("6943515153")).toEqual(bad("length"));
        expect(validateHrvatskaOsobniIdentifikacijskiBroj("6943515153x")).toEqual(
            bad("characters"),
        );
    });
});

describe("validateSlovenijaEmso", () => {
    test("a worked example", () => {
        expect(validateSlovenijaEmso("0101006500006")).toEqual(ok);
    });
    test("a failed check, an unreal date, length and characters", () => {
        expect(validateSlovenijaEmso("0101006500007")).toEqual(bad("checksum"));
        expect(validateSlovenijaEmso("3102006500006")).toEqual(bad("date"));
        expect(validateSlovenijaEmso("010100650000")).toEqual(bad("length"));
        expect(validateSlovenijaEmso("010100650000x")).toEqual(bad("characters"));
    });
    test("a check that would be 10 is never issued", () => {
        const weights = [7, 6, 5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
        const stem = [...Array(100).keys()]
            .map((n) => "01010065" + String(n).padStart(2, "0") + "00")
            .find(
                (t) =>
                    11 - ([...t].reduce((sum, c, i) => sum + Number(c) * weights[i], 0) % 11) ===
                    10,
            )!;
        expect(validateSlovenijaEmso(stem + "0")).toEqual(bad("checksum"));
    });
});

describe("validateRomaniaCodNumericPersonal", () => {
    test("a worked example", () => {
        expect(validateRomaniaCodNumericPersonal("1800101221144")).toEqual(ok);
    });
    test("a failed check, an unknown county, an unreal date, length and characters", () => {
        expect(validateRomaniaCodNumericPersonal("1800101221145")).toEqual(bad("checksum"));
        expect(validateRomaniaCodNumericPersonal("1800101991144")).toEqual(bad("structure"));
        expect(validateRomaniaCodNumericPersonal("1800231221144")).toEqual(bad("date"));
        expect(validateRomaniaCodNumericPersonal("180010122114")).toEqual(bad("length"));
        expect(validateRomaniaCodNumericPersonal("180010122114x")).toEqual(bad("characters"));
    });
});

describe("validateOsterreichSozialversicherungsnummer", () => {
    test("a worked example", () => {
        expect(validateOsterreichSozialversicherungsnummer("1237 010180")).toEqual(ok);
    });
    test("a failed check, an unreal date, a leading zero, length and characters", () => {
        expect(validateOsterreichSozialversicherungsnummer("1238 010180")).toEqual(bad("checksum"));
        expect(validateOsterreichSozialversicherungsnummer("1237 320180")).toEqual(bad("date"));
        expect(validateOsterreichSozialversicherungsnummer("0237 010180")).toEqual(
            bad("structure"),
        );
        expect(validateOsterreichSozialversicherungsnummer("1237 01018")).toEqual(bad("length"));
        expect(validateOsterreichSozialversicherungsnummer("1237 01018x")).toEqual(
            bad("characters"),
        );
    });
});

describe("validateIslandKennitala", () => {
    test("a worked example, and a company's day with 40 added", () => {
        expect(validateIslandKennitala("010130-2989")).toEqual(ok);
        const weights = [3, 2, 7, 6, 5, 4, 3, 2];
        const stem = [...Array(100).keys()]
            .map((n) => "410130" + String(n).padStart(2, "0"))
            .find(
                (t) =>
                    ![10].includes(
                        11 - ([...t].reduce((sum, c, i) => sum + Number(c) * weights[i], 0) % 11),
                    ),
            )!;
        const sum = [...stem].reduce((t, c, i) => t + Number(c) * weights[i], 0);
        const check = 11 - (sum % 11) === 11 ? 0 : 11 - (sum % 11);
        expect(validateIslandKennitala(`${stem}${check}9`)).toEqual(ok);
    });
    test("a failed check, a century digit of 5, an unreal date, length and characters", () => {
        expect(validateIslandKennitala("010130-2999")).toEqual(bad("checksum"));
        expect(validateIslandKennitala("010130-2985")).toEqual(bad("structure"));
        expect(validateIslandKennitala("320130-2989")).toEqual(bad("date"));
        expect(validateIslandKennitala("010130-298")).toEqual(bad("length"));
        expect(validateIslandKennitala("010130-298x")).toEqual(bad("characters"));
    });
});

describe("validateYisraelTeudatZehut", () => {
    test("a worked example, and an all-but-zero number", () => {
        expect(validateYisraelTeudatZehut("123456782")).toEqual(ok);
        expect(validateYisraelTeudatZehut("000000018")).toEqual(ok);
    });
    test("a failed check, a number that is not padded, length and characters", () => {
        expect(validateYisraelTeudatZehut("123456783")).toEqual(bad("checksum"));
        expect(validateYisraelTeudatZehut("18")).toEqual(bad("length"));
        expect(validateYisraelTeudatZehut("12345678x")).toEqual(bad("characters"));
    });
});

describe("validateIranKodEMelli", () => {
    test("a worked example, and a remainder under 2", () => {
        expect(validateIranKodEMelli("0499370899")).toEqual(ok);
        const weights = [10, 9, 8, 7, 6, 5, 4, 3, 2];
        const stem = [...Array(1000).keys()]
            .map((n) => "123456" + String(n).padStart(3, "0"))
            .find((t) => [...t].reduce((sum, c, i) => sum + Number(c) * weights[i], 0) % 11 < 2)!;
        const remainder = [...stem].reduce((sum, c, i) => sum + Number(c) * weights[i], 0) % 11;
        expect(validateIranKodEMelli(stem + remainder)).toEqual(ok);
    });
    test("a failed check, one repeated digit, length and characters", () => {
        expect(validateIranKodEMelli("0499370898")).toEqual(bad("checksum"));
        expect(validateIranKodEMelli("1111111111")).toEqual(bad("structure"));
        expect(validateIranKodEMelli("049937089")).toEqual(bad("length"));
        expect(validateIranKodEMelli("049937089x")).toEqual(bad("characters"));
    });
});

describe("validateAlImaratRaqmAlHuwiyah", () => {
    const withCheck = (stem: string) =>
        stem + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].find((c) => luhnValid(stem + c));
    test("a number with a valid Luhn check, with dashes", () => {
        const id = withCheck("78419851234567");
        expect(validateAlImaratRaqmAlHuwiyah(id)).toEqual(ok);
        expect(
            validateAlImaratRaqmAlHuwiyah(
                `${id.slice(0, 3)}-${id.slice(3, 7)}-${id.slice(7, 14)}-${id.slice(14)}`,
            ),
        ).toEqual(ok);
    });
    test("a failed check, another country code, length and characters", () => {
        const id = withCheck("78419851234567");
        expect(
            validateAlImaratRaqmAlHuwiyah(id.slice(0, 14) + String((Number(id[14]) + 1) % 10)),
        ).toEqual(bad("checksum"));
        expect(validateAlImaratRaqmAlHuwiyah(withCheck("78519851234567"))).toEqual(
            bad("structure"),
        );
        expect(validateAlImaratRaqmAlHuwiyah("78419851234567")).toEqual(bad("length"));
        expect(validateAlImaratRaqmAlHuwiyah("78419851234567x")).toEqual(bad("characters"));
    });
});

describe("validateHongKongIdentityCard", () => {
    test("a worked example, with and without brackets", () => {
        expect(validateHongKongIdentityCard("A123456(3)")).toEqual(ok);
        expect(validateHongKongIdentityCard("A1234563")).toEqual(ok);
    });
    test("a two-letter prefix, and checks of A and 0", () => {
        const check = (letters: string, digits: string) => {
            const values = [
                letters.length === 1 ? 36 : letters.charCodeAt(0) - 55,
                letters.charCodeAt(letters.length - 1) - 55,
                ...[...digits].map(Number),
            ];
            const r = 11 - (values.reduce((t, n, i) => t + n * (9 - i), 0) % 11);
            return r === 11 ? "0" : r === 10 ? "A" : String(r);
        };
        expect(validateHongKongIdentityCard(`XY987654(${check("XY", "987654")})`)).toEqual(ok);
        const withA = [...Array(1000).keys()]
            .map((n) => String(n).padStart(6, "0"))
            .find((d) => check("Z", d) === "A")!;
        const withZero = [...Array(1000).keys()]
            .map((n) => String(n).padStart(6, "0"))
            .find((d) => check("Z", d) === "0")!;
        expect(validateHongKongIdentityCard(`Z${withA}(A)`)).toEqual(ok);
        expect(validateHongKongIdentityCard(`Z${withZero}(0)`)).toEqual(ok);
    });
    test("a failed check, structure, length and characters", () => {
        expect(validateHongKongIdentityCard("A123456(4)")).toEqual(bad("checksum"));
        expect(validateHongKongIdentityCard("123456AB(3)")).toEqual(bad("structure"));
        expect(validateHongKongIdentityCard("A12345(3)")).toEqual(bad("length"));
        expect(validateHongKongIdentityCard("a123456(3)")).toEqual(bad("characters"));
    });
});

describe("validatePrathetThaiLekPrajamTuaPrachachon", () => {
    test("a worked example", () => {
        expect(validatePrathetThaiLekPrajamTuaPrachachon("1-1017-00207-03-0")).toEqual(ok);
    });
    test("a failed check, length and characters", () => {
        expect(validatePrathetThaiLekPrajamTuaPrachachon("1-1017-00207-03-1")).toEqual(
            bad("checksum"),
        );
        expect(validatePrathetThaiLekPrajamTuaPrachachon("1-1017-00207-03")).toEqual(bad("length"));
        expect(validatePrathetThaiLekPrajamTuaPrachachon("1-1017-00207-03-x")).toEqual(
            bad("characters"),
        );
    });
});

describe("validateAustraliaIndividualHealthcareIdentifier", () => {
    const withCheck = (stem: string) =>
        stem + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].find((c) => luhnValid(stem + c));
    test("a number with the prefix and a Luhn check, with spaces", () => {
        const id = withCheck("800360123456789");
        expect(validateAustraliaIndividualHealthcareIdentifier(id)).toEqual(ok);
        expect(
            validateAustraliaIndividualHealthcareIdentifier(id.replace(/(\d{4})/g, "$1 ")),
        ).toEqual(ok);
    });
    test("a failed check, another prefix, length and characters", () => {
        const id = withCheck("800360123456789");
        expect(
            validateAustraliaIndividualHealthcareIdentifier(
                id.slice(0, 15) + String((Number(id[15]) + 1) % 10),
            ),
        ).toEqual(bad("checksum"));
        expect(
            validateAustraliaIndividualHealthcareIdentifier(withCheck("800361123456789")),
        ).toEqual(bad("structure"));
        expect(validateAustraliaIndividualHealthcareIdentifier("800360123456789")).toEqual(
            bad("length"),
        );
        expect(validateAustraliaIndividualHealthcareIdentifier(id.slice(0, 15) + "x")).toEqual(
            bad("characters"),
        );
    });
});

describe("validateDeutschlandKrankenversichertennummer", () => {
    test("a worked example", () => {
        expect(validateDeutschlandKrankenversichertennummer("A123456780")).toEqual(ok);
    });
    test("a two-digit letter position, and a product over 9", () => {
        const check = (letter: string, eight: string) => {
            const position = letter.charCodeAt(0) - 64;
            const digits = [Math.floor(position / 10), position % 10, ...[...eight].map(Number)];
            const sum = digits.reduce(
                (t, n, i) =>
                    t + [n * (i % 2 === 0 ? 1 : 2)].map((p) => Math.floor(p / 10) + (p % 10))[0],
                0,
            );
            return sum % 10;
        };
        expect(
            validateDeutschlandKrankenversichertennummer(`Z98765432${check("Z", "98765432")}`),
        ).toEqual(ok);
    });
    test("a failed check, structure, length and characters", () => {
        expect(validateDeutschlandKrankenversichertennummer("A123456781")).toEqual(bad("checksum"));
        expect(validateDeutschlandKrankenversichertennummer("1123456780")).toEqual(
            bad("structure"),
        );
        expect(validateDeutschlandKrankenversichertennummer("A12345678")).toEqual(bad("length"));
        expect(validateDeutschlandKrankenversichertennummer("A12345678?")).toEqual(
            bad("characters"),
        );
    });
});

describe("validatePolskaNumerIdentyfikacjiPodatkowej", () => {
    test("a worked example, with dashes", () => {
        expect(validatePolskaNumerIdentyfikacjiPodatkowej("526-025-02-74")).toEqual(ok);
    });
    test("a remainder of 10 is never issued, and the usual failures", () => {
        const weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];
        const stem = [...Array(1000).keys()]
            .map((n) => "526025" + String(n).padStart(3, "0"))
            .find(
                (t) => [...t].reduce((sum, c, i) => sum + Number(c) * weights[i], 0) % 11 === 10,
            )!;
        expect(validatePolskaNumerIdentyfikacjiPodatkowej(stem + "0")).toEqual(bad("checksum"));
        expect(validatePolskaNumerIdentyfikacjiPodatkowej("526-025-02-75")).toEqual(
            bad("checksum"),
        );
        expect(validatePolskaNumerIdentyfikacjiPodatkowej("526-025-02")).toEqual(bad("length"));
        expect(validatePolskaNumerIdentyfikacjiPodatkowej("526-025-02-7x")).toEqual(
            bad("characters"),
        );
    });
});

describe("validateUnitedKingdomNationalInsuranceNumber", () => {
    test("a valid number, with spaces", () => {
        expect(validateUnitedKingdomNationalInsuranceNumber("AB 12 34 56 C")).toEqual(ok);
        expect(validateUnitedKingdomNationalInsuranceNumber("JG103759A")).toEqual(ok);
    });
    test("a prefix letter that is never used, a prefix never issued, a suffix of E, length and characters", () => {
        expect(validateUnitedKingdomNationalInsuranceNumber("DA123456C")).toEqual(bad("structure"));
        expect(validateUnitedKingdomNationalInsuranceNumber("AO123456C")).toEqual(bad("structure"));
        expect(validateUnitedKingdomNationalInsuranceNumber("BG123456C")).toEqual(bad("structure"));
        expect(validateUnitedKingdomNationalInsuranceNumber("ZZ123456C")).toEqual(bad("structure"));
        expect(validateUnitedKingdomNationalInsuranceNumber("AB123456E")).toEqual(bad("structure"));
        expect(validateUnitedKingdomNationalInsuranceNumber("AB12345C")).toEqual(bad("length"));
        expect(validateUnitedKingdomNationalInsuranceNumber("ab123456c")).toEqual(
            bad("characters"),
        );
    });
});

describe("validateUnitedStatesSocialSecurityNumber", () => {
    test("a valid number, with dashes", () => {
        expect(validateUnitedStatesSocialSecurityNumber("123-45-6789")).toEqual(ok);
        expect(validateUnitedStatesSocialSecurityNumber("899-99-9999")).toEqual(ok);
    });
    test("an area of 000, 666 or 900 and over, a group of 00, a serial of 0000, length and characters", () => {
        expect(validateUnitedStatesSocialSecurityNumber("000-12-3456")).toEqual(bad("structure"));
        expect(validateUnitedStatesSocialSecurityNumber("666-12-3456")).toEqual(bad("structure"));
        expect(validateUnitedStatesSocialSecurityNumber("900-12-3456")).toEqual(bad("structure"));
        expect(validateUnitedStatesSocialSecurityNumber("123-00-6789")).toEqual(bad("structure"));
        expect(validateUnitedStatesSocialSecurityNumber("123-45-0000")).toEqual(bad("structure"));
        expect(validateUnitedStatesSocialSecurityNumber("123-45-678")).toEqual(bad("length"));
        expect(validateUnitedStatesSocialSecurityNumber("123-45-678x")).toEqual(bad("characters"));
    });
});

describe("validateQazaqstanZhekeSaikestendiruNomiri", () => {
    const check = (eleven: string) => {
        const d = [...eleven].map(Number);
        let c = d.reduce((t, n, i) => t + n * (i + 1), 0) % 11;
        if (c === 10)
            c = d.reduce((t, n, i) => t + n * [3, 4, 5, 6, 7, 8, 9, 10, 11, 1, 2][i], 0) % 11;
        return c;
    };
    test("numbers of each century, and one needing the second weights", () => {
        for (const stem of ["85010150123", "01010130123", "10010150123"]) {
            const c = check(stem);
            if (c !== 10) expect(validateQazaqstanZhekeSaikestendiruNomiri(stem + c)).toEqual(ok);
        }
        const second = [...Array(10000).keys()]
            .map((n) => `8501015${String(n).padStart(4, "0")}`)
            .find(
                (t) =>
                    [...t].reduce((sum, c, i) => sum + Number(c) * (i + 1), 0) % 11 === 10 &&
                    check(t) !== 10,
            )!;
        expect(validateQazaqstanZhekeSaikestendiruNomiri(second + check(second))).toEqual(ok);
    });
    test("a failed check, a century digit of 7, an unreal date, length and characters", () => {
        const good = "85010150123" + check("85010150123");
        expect(
            validateQazaqstanZhekeSaikestendiruNomiri(
                good.slice(0, 11) + String((Number(good[11]) + 1) % 10),
            ),
        ).toEqual(bad("checksum"));
        expect(validateQazaqstanZhekeSaikestendiruNomiri("850101701234")).toEqual(bad("structure"));
        expect(validateQazaqstanZhekeSaikestendiruNomiri("851301501234")).toEqual(bad("date"));
        expect(validateQazaqstanZhekeSaikestendiruNomiri("8501015012")).toEqual(bad("length"));
        expect(validateQazaqstanZhekeSaikestendiruNomiri("85010150123x")).toEqual(
            bad("characters"),
        );
    });
});

describe("validateUkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkiv", () => {
    const withCheck = (nine: string) => {
        const sum = [...nine].reduce(
            (t, c, i) => t + Number(c) * [-1, 5, 7, 9, 4, 6, 10, 5, 7][i],
            0,
        );
        return nine + String((((sum % 11) + 11) % 11) % 10);
    };
    test("a number with a valid check", () => {
        expect(
            validateUkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkiv(
                withCheck("304310706"),
            ),
        ).toEqual(ok);
        expect(
            validateUkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkiv(
                withCheck("100000000"),
            ),
        ).toEqual(ok);
    });
    test("a failed check, length and characters", () => {
        const good = withCheck("304310706");
        expect(
            validateUkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkiv(
                good.slice(0, 9) + String((Number(good[9]) + 1) % 10),
            ),
        ).toEqual(bad("checksum"));
        expect(
            validateUkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkiv("304310706"),
        ).toEqual(bad("length"));
        expect(
            validateUkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkiv("30431070x6"),
        ).toEqual(bad("characters"));
    });
});

describe("validateAsSaudiyahRaqmAlHuwiyahAlWataniyah", () => {
    const withCheck = (stem: string) =>
        stem + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].find((c) => luhnValid(stem + c));
    test("a citizen's and a resident's number", () => {
        expect(validateAsSaudiyahRaqmAlHuwiyahAlWataniyah(withCheck("108765432"))).toEqual(ok);
        expect(validateAsSaudiyahRaqmAlHuwiyahAlWataniyah(withCheck("212345678"))).toEqual(ok);
    });
    test("a failed check, another first digit, length and characters", () => {
        const good = withCheck("108765432");
        expect(
            validateAsSaudiyahRaqmAlHuwiyahAlWataniyah(
                good.slice(0, 9) + String((Number(good[9]) + 1) % 10),
            ),
        ).toEqual(bad("checksum"));
        expect(validateAsSaudiyahRaqmAlHuwiyahAlWataniyah(withCheck("308765432"))).toEqual(
            bad("structure"),
        );
        expect(validateAsSaudiyahRaqmAlHuwiyahAlWataniyah("108765432")).toEqual(bad("length"));
        expect(validateAsSaudiyahRaqmAlHuwiyahAlWataniyah("10876543x2")).toEqual(bad("characters"));
    });
});

describe("validateEspanaCodigoDeIdentificacionFiscal", () => {
    test("a worked example, and each end of the letter table", () => {
        expect(validateEspanaCodigoDeIdentificacionFiscal("12345678Z")).toEqual(ok);
        expect(validateEspanaCodigoDeIdentificacionFiscal("00000000T")).toEqual(ok);
        expect(validateEspanaCodigoDeIdentificacionFiscal("00000022E")).toEqual(ok);
    });
    test("a wrong letter, a letter outside the table, length, characters and structure", () => {
        expect(validateEspanaCodigoDeIdentificacionFiscal("12345678A")).toEqual(bad("checksum"));
        expect(validateEspanaCodigoDeIdentificacionFiscal("12345678U")).toEqual(bad("checksum"));
        expect(validateEspanaCodigoDeIdentificacionFiscal("1234567Z")).toEqual(bad("length"));
        expect(validateEspanaCodigoDeIdentificacionFiscal("12345678z")).toEqual(bad("characters"));
        expect(validateEspanaCodigoDeIdentificacionFiscal("X2345678Z")).toEqual(bad("structure"));
    });
});

describe("validateDanmarkPersonnummer", () => {
    test("each century rule", () => {
        expect(validateDanmarkPersonnummer("010180-1234")).toEqual(ok);
        expect(validateDanmarkPersonnummer("010105-4234")).toEqual(ok);
        expect(validateDanmarkPersonnummer("010160-4234")).toEqual(ok);
        expect(validateDanmarkPersonnummer("010105-5234")).toEqual(ok);
        expect(validateDanmarkPersonnummer("010160-5234")).toEqual(ok);
        expect(validateDanmarkPersonnummer("290200-5234")).toEqual(ok);
        expect(validateDanmarkPersonnummer("290259-5234")).toEqual(bad("date"));
    });
    test("a date that does not exist, length and characters", () => {
        expect(validateDanmarkPersonnummer("310280-1234")).toEqual(bad("date"));
        expect(validateDanmarkPersonnummer("011380-1234")).toEqual(bad("date"));
        expect(validateDanmarkPersonnummer("010180-123")).toEqual(bad("length"));
        expect(validateDanmarkPersonnummer("010180-123x")).toEqual(bad("characters"));
    });
});

describe("validateMalaysiaKadPengenalan", () => {
    test("a valid date, with dashes", () => {
        expect(validateMalaysiaKadPengenalan("800101-14-5678")).toEqual(ok);
    });
    test("an unreal date, length and characters", () => {
        expect(validateMalaysiaKadPengenalan("801301-14-5678")).toEqual(bad("date"));
        expect(validateMalaysiaKadPengenalan("800431-14-5678")).toEqual(bad("date"));
        expect(validateMalaysiaKadPengenalan("800101-14-567")).toEqual(bad("length"));
        expect(validateMalaysiaKadPengenalan("800101-14-567x")).toEqual(bad("characters"));
    });
});

describe("validateIndonesiaNomorIndukKependudukan", () => {
    test("a man's and a woman's number", () => {
        expect(validateIndonesiaNomorIndukKependudukan("3171010110800001")).toEqual(ok);
        expect(validateIndonesiaNomorIndukKependudukan("3171015110800001")).toEqual(ok);
    });
    test("a province of 00, an unreal date, length and characters", () => {
        expect(validateIndonesiaNomorIndukKependudukan("0071010110800001")).toEqual(
            bad("structure"),
        );
        expect(validateIndonesiaNomorIndukKependudukan("3171013110800001")).toEqual(ok);
        expect(validateIndonesiaNomorIndukKependudukan("3171011113800001")).toEqual(bad("date"));
        expect(validateIndonesiaNomorIndukKependudukan("317101011080000")).toEqual(bad("length"));
        expect(validateIndonesiaNomorIndukKependudukan("317101011080000x")).toEqual(
            bad("characters"),
        );
    });
});
