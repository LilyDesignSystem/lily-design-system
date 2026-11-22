/**
 * Validation and check-digit logic for national personal identifiers (spec/national-identifiers). Pure functions: no DOM, no
 * locale, no persistence. The components stay headless and never call these; a consumer validates when it wants to.
 *
 * Each `validate*` takes the identifier as typed (spaces, dots, dashes and slashes are separators and are ignored) and returns
 * an `IdentifierResult`: `{ valid: true }`, or `{ valid: false, reason }` saying which rule failed. A string that breaks a
 * rule is invalid data, so it is reported, never repaired or defaulted: nothing is trimmed to length, padded, re-cased or
 * guessed. A value that is not a string at all is a programming error and throws a `TypeError`.
 *
 * Only algorithms that are published and checkable against a worked example are here. A type with no check digit gets its
 * format rules only, and a type whose algorithm is not documented is not here at all (see spec/national-identifiers).
 */

export type IdentifierReason =
    /** Characters that cannot appear in this identifier. */
    | "characters"
    /** The wrong number of characters. */
    | "length"
    /** The check digit or check letter does not match. */
    | "checksum"
    /** An embedded date of birth that is not a real calendar date. */
    | "date"
    /** Another structural rule of the scheme (an unassigned prefix, a reserved block, an impossible serial). */
    | "structure";

export type IdentifierResult = { valid: true } | { valid: false; reason: IdentifierReason };

const OK: IdentifierResult = { valid: true };
const no = (reason: IdentifierReason): IdentifierResult => ({ valid: false, reason });

function text(value: unknown, name: string): string {
    if (typeof value !== "string")
        throw new TypeError(`${name}: expected a string, got ${typeof value}`);
    return value;
}

/** The identifier with its separators (space, dot, dash, slash) removed; nothing else is touched. */
export function stripSeparators(value: string): string {
    return value.replace(/[ .\-/]/g, "");
}

const isDigits = (s: string): boolean => /^[0-9]+$/.test(s);
const digitsOf = (s: string): number[] => [...s].map(Number);

// ---------------------------------------------------------------------------------------------------------------------
// Check-digit primitives

/** True when `digits` (the whole number, check digit last) passes the Luhn check (ISO/IEC 7812-1). */
export function luhnValid(digits: string): boolean {
    if (!isDigits(digits)) return false;
    let sum = 0;
    let double = false;
    for (let i = digits.length - 1; i >= 0; i--) {
        let d = digits.charCodeAt(i) - 48;
        if (double) {
            d *= 2;
            if (d > 9) d -= 9;
        }
        sum += d;
        double = !double;
    }
    return sum % 10 === 0;
}

/** The sum of each digit times its weight, over as many digits as there are weights. */
export function weightedSum(digits: readonly number[], weights: readonly number[]): number {
    let sum = 0;
    for (let i = 0; i < weights.length; i++) sum += digits[i] * weights[i];
    return sum;
}

const VERHOEFF_D = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
    [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
    [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
    [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
    [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
    [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
    [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
    [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
];
const VERHOEFF_P = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
    [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
    [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
    [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
    [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
    [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
    [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
];

/** True when `digits` (check digit last) passes the Verhoeff check. */
export function verhoeffValid(digits: string): boolean {
    if (!isDigits(digits)) return false;
    let c = 0;
    const reversed = digitsOf(digits).reverse();
    for (let i = 0; i < reversed.length; i++) c = VERHOEFF_D[c][VERHOEFF_P[i % 8][reversed[i]]];
    return c === 0;
}

/** True when year, month and day (month 1 to 12) name a real calendar day; the year is a full year. */
export function isCalendarDate(year: number, month: number, day: number): boolean {
    if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return false;
    if (month < 1 || month > 12 || day < 1) return false;
    return day <= new Date(Date.UTC(2000 + (year % 400), month, 0)).getUTCDate();
}

// ---------------------------------------------------------------------------------------------------------------------
// Identifiers

/**
 * The NHS number of England, Wales and the Isle of Man, and the Health and Care Number of Northern Ireland: ten digits, the
 * tenth a Modulus-11 check digit over the first nine with weights 10 down to 2. A remainder that would give check digit 10
 * is never issued, so it is invalid.
 */
export function validateNhsNumber(value: string): IdentifierResult {
    const s = stripSeparators(text(value, "validateNhsNumber"));
    if (!isDigits(s)) return no("characters");
    if (s.length !== 10) return no("length");
    const d = digitsOf(s);
    const remainder = weightedSum(d, [10, 9, 8, 7, 6, 5, 4, 3, 2]) % 11;
    const check = remainder === 0 ? 0 : 11 - remainder;
    if (check === 10 || check !== d[9]) return no("checksum");
    return OK;
}

/** The Canadian Social Insurance Number: nine digits passing the Luhn check. */
export function validateCanadaSocialInsuranceNumber(value: string): IdentifierResult {
    const s = stripSeparators(text(value, "validateCanadaSocialInsuranceNumber"));
    if (!isDigits(s)) return no("characters");
    if (s.length !== 9) return no("length");
    return luhnValid(s) ? OK : no("checksum");
}

/** The Dutch citizen service number (BSN): nine digits satisfying the 11-proof, weights 9 to 2 and then -1, and not all zeros. */
export function validateNederlandBurgerservicenummer(value: string): IdentifierResult {
    const s = stripSeparators(text(value, "validateNederlandBurgerservicenummer"));
    if (!isDigits(s)) return no("characters");
    if (s.length !== 9) return no("length");
    const d = digitsOf(s);
    const sum = weightedSum(d, [9, 8, 7, 6, 5, 4, 3, 2, -1]);
    return sum % 11 === 0 && sum !== 0 ? OK : no("checksum");
}

/**
 * The Belgian National Register Number: eleven digits, YYMMDD, a three-digit serial (odd for men, even for women), and a
 * two-digit check equal to 97 minus the first nine digits modulo 97, computed with a leading 2 for someone born in 2000 or
 * later. The century is not written, so both are tried; a number valid under neither is a checksum failure. Where the
 * date part is zero (a person whose birth date is not known) the date is not checked.
 */
export function validateBelgiqueRegistreNational(value: string): IdentifierResult {
    const s = stripSeparators(text(value, "validateBelgiqueRegistreNational"));
    if (!isDigits(s)) return no("characters");
    if (s.length !== 11) return no("length");
    const month = Number(s.slice(2, 4));
    const day = Number(s.slice(4, 6));
    // A month or day of 00 is allowed for an unknown or estimated birth date; a month above 12 is a bis number (20 or 40 added).
    if (month > 12 && !(month >= 20 && month <= 32) && !(month >= 40 && month <= 52))
        return no("date");
    if (day > 31) return no("date");
    if (Number(s.slice(6, 9)) === 0) return no("structure");
    const check = Number(s.slice(9));
    const base = Number(s.slice(0, 9));
    const expected = (n: number) => 97 - (n % 97);
    return check === expected(base) || check === expected(2_000_000_000 + base)
        ? OK
        : no("checksum");
}

/**
 * The Swedish personal identity number (personnummer): ten digits as YYMMDDNNNC, or twelve as YYYYMMDDNNNC, the last a Luhn
 * check over the ten-digit form, and a real date (a day above 60 is a samordningsnummer, the real day plus 60).
 */
export function validateSverigePersonnummer(value: string): IdentifierResult {
    const s = stripSeparators(text(value, "validateSverigePersonnummer").replace(/\+/g, ""));
    if (!isDigits(s)) return no("characters");
    if (s.length !== 10 && s.length !== 12) return no("length");
    const ten = s.length === 12 ? s.slice(2) : s;
    const yy = Number(ten.slice(0, 2));
    const mm = Number(ten.slice(2, 4));
    let dd = Number(ten.slice(4, 6));
    if (dd > 60) dd -= 60;
    const year = s.length === 12 ? Number(s.slice(0, 4)) : 2000 + yy;
    // Without a century only the month and the largest day of any year can be checked.
    if (s.length === 12 ? !isCalendarDate(year, mm, dd) : mm < 1 || mm > 12 || dd < 1 || dd > 31)
        return no("date");
    return luhnValid(ten) ? OK : no("checksum");
}

/**
 * The Polish PESEL: eleven digits, YYMMDD with the month carrying the century (+80 for 1800s, +20 for 2000s, +40 for 2100s,
 * +60 for 2200s), a serial, and a check digit from weights 1 3 7 9 1 3 7 9 1 3.
 */
export function validatePolskaPesel(value: string): IdentifierResult {
    const s = stripSeparators(text(value, "validatePolskaPesel"));
    if (!isDigits(s)) return no("characters");
    if (s.length !== 11) return no("length");
    const d = digitsOf(s);
    const yy = Number(s.slice(0, 2));
    const monthField = Number(s.slice(2, 4));
    const dd = Number(s.slice(4, 6));
    const century = [1900, 2000, 2100, 2200, 1800][Math.floor(monthField / 20)];
    const mm = monthField % 20;
    if (century === undefined || !isCalendarDate(century + yy, mm, dd)) return no("date");
    const check = (10 - (weightedSum(d, [1, 3, 7, 9, 1, 3, 7, 9, 1, 3]) % 10)) % 10;
    return check === d[10] ? OK : no("checksum");
}

/** The Australian Tax File Number: nine digits (eight are issued to some), weights 1 4 3 7 5 8 6 9 10, sum divisible by 11. */
export function validateAustraliaTaxFileNumber(value: string): IdentifierResult {
    const s = stripSeparators(text(value, "validateAustraliaTaxFileNumber"));
    if (!isDigits(s)) return no("characters");
    if (s.length !== 9) return no("length");
    return weightedSum(digitsOf(s), [1, 4, 3, 7, 5, 8, 6, 9, 10]) % 11 === 0 ? OK : no("checksum");
}

/** The Indian Aadhaar number: twelve digits, the first 2 to 9, the last a Verhoeff check. */
export function validateBharatAadhaar(value: string): IdentifierResult {
    const s = stripSeparators(text(value, "validateBharatAadhaar"));
    if (!isDigits(s)) return no("characters");
    if (s.length !== 12) return no("length");
    if (s[0] === "0" || s[0] === "1") return no("structure");
    return verhoeffValid(s) ? OK : no("checksum");
}

/** The Swiss AHV (social security) number: thirteen digits starting 756, the last an EAN-13 check. */
export function validateSchweizAhvNummer(value: string): IdentifierResult {
    const s = stripSeparators(text(value, "validateSchweizAhvNummer"));
    if (!isDigits(s)) return no("characters");
    if (s.length !== 13) return no("length");
    if (!s.startsWith("756")) return no("structure");
    const d = digitsOf(s);
    const sum = d.slice(0, 12).reduce((total, n, i) => total + n * (i % 2 === 0 ? 1 : 3), 0);
    return (10 - (sum % 10)) % 10 === d[12] ? OK : no("checksum");
}

/** `digits` modulo `n`, digit by digit, so a long number needs no big integers. */
function modulo(digits: string, n: number): number {
    let r = 0;
    for (const c of digits) r = (r * 10 + (c.charCodeAt(0) - 48)) % n;
    return r;
}

/**
 * The French NIR (social security number): 15 characters, a 13-character body (sex, birth year and month, department,
 * commune, order; Corsica's department is 2A or 2B) and a two-digit key equal to 97 minus the body modulo 97, with 2A read
 * as 19 and 2B as 18.
 */
export function validateFranceNir(value: string): IdentifierResult {
    const s = stripSeparators(text(value, "validateFranceNir")).toUpperCase();
    if (!/^[0-9A-B]+$/.test(s)) return no("characters");
    if (s.length !== 15) return no("length");
    if (!/^[0-9]{5}(?:[0-9]{2}|2A|2B)[0-9]{8}$/.test(s)) return no("structure");
    const body = s.slice(0, 13).replace("2A", "19").replace("2B", "18");
    return 97 - modulo(body, 97) === Number(s.slice(13)) ? OK : no("checksum");
}

/** The Turkish citizen number (TC Kimlik): eleven digits, the first not 0, and two check digits. */
export function validateTurkiyeTcKimlikNumarasi(value: string): IdentifierResult {
    const s = stripSeparators(text(value, "validateTurkiyeTcKimlikNumarasi"));
    if (!isDigits(s)) return no("characters");
    if (s.length !== 11) return no("length");
    if (s[0] === "0") return no("structure");
    const d = digitsOf(s);
    const odd = d[0] + d[2] + d[4] + d[6] + d[8];
    const even = d[1] + d[3] + d[5] + d[7];
    const tenth = (((odd * 7 - even) % 10) + 10) % 10;
    if (tenth !== d[9]) return no("checksum");
    const eleventh = d.slice(0, 10).reduce((a, b) => a + b, 0) % 10;
    return eleventh === d[10] ? OK : no("checksum");
}

// ---------------------------------------------------------------------------------------------------------------------
// Modulus-11 and date-encoded identifiers (P43-T3, first family)

/** The largest day any year gives `month`: February is 29, because the century of a two-digit year is not always known. */
function maxDay(month: number): number {
    return month === 2 ? 29 : [4, 6, 9, 11].includes(month) ? 30 : 31;
}

/**
 * The Bulgarian Uniform Civil Number (EGN): ten digits, YYMMDD with the century in the month (+20 for the 1800s, +40 for the
 * 2000s), a three-digit serial and a check digit, the weighted sum 2 4 8 5 10 9 7 3 6 modulo 11 (a remainder of 10 gives 0).
 */
export function validateBulgariaEdinenGrazhdanskiNomer(value: string): IdentifierResult {
    const s = stripSeparators(text(value, "validateBulgariaEdinenGrazhdanskiNomer"));
    if (!isDigits(s)) return no("characters");
    if (s.length !== 10) return no("length");
    const d = digitsOf(s);
    const yy = Number(s.slice(0, 2));
    const monthField = Number(s.slice(2, 4));
    const century = monthField > 40 ? 2000 : monthField > 20 ? 1800 : 1900;
    const month = monthField - (century === 2000 ? 40 : century === 1800 ? 20 : 0);
    const day = Number(s.slice(4, 6));
    if (month < 1 || month > 12 || day < 1 || !isCalendarDate(century + yy, month, day))
        return no("date");
    const check = (weightedSum(d, [2, 4, 8, 5, 10, 9, 7, 3, 6]) % 11) % 10;
    return check === d[9] ? OK : no("checksum");
}

/**
 * The Norwegian national identity number (fodselsnummer): eleven digits, DDMMYY, a three-digit individual number and two
 * Modulus-11 check digits (weights 3 7 6 1 8 9 4 5 2, then 5 4 3 2 7 6 5 4 3 2 over the ten digits so far); a check that would
 * be 10 is never issued. A D-number adds 4 to the first digit of the day, an H-number adds 4 to the first digit of the month.
 */
export function validateNorgeFodselsnummer(value: string): IdentifierResult {
    const s = stripSeparators(text(value, "validateNorgeFodselsnummer"));
    if (!isDigits(s)) return no("characters");
    if (s.length !== 11) return no("length");
    const d = digitsOf(s);
    let day = Number(s.slice(0, 2));
    let month = Number(s.slice(2, 4));
    if (day > 40) day -= 40;
    if (month > 40) month -= 40;
    const yy = Number(s.slice(4, 6));
    const serial = Number(s.slice(6, 9));
    const century =
        serial < 500
            ? 1900
            : serial < 750 && yy >= 54
              ? 1800
              : serial >= 900 && yy >= 40
                ? 1900
                : yy < 40
                  ? 2000
                  : 0;
    if (century === 0 || !isCalendarDate(century + yy, month, day)) return no("date");
    const first = 11 - (weightedSum(d, [3, 7, 6, 1, 8, 9, 4, 5, 2]) % 11);
    const k1 = first === 11 ? 0 : first;
    const second = 11 - (weightedSum(d, [5, 4, 3, 2, 7, 6, 5, 4, 3, 2]) % 11);
    const k2 = second === 11 ? 0 : second;
    return k1 === d[9] && k2 === d[10] && k1 !== 10 && k2 !== 10 ? OK : no("checksum");
}

/**
 * The Estonian personal identification code (isikukood): eleven digits, a century-and-sex digit (1 to 8), YYMMDD, a serial and a
 * check digit from weights 1 2 3 4 5 6 7 8 9 1 modulo 11, or, when that is 10, weights 3 4 5 6 7 8 9 1 2 3 (and 0 if that is 10 too).
 */
export function validateEestiIsikukood(value: string): IdentifierResult {
    const s = stripSeparators(text(value, "validateEestiIsikukood"));
    if (!isDigits(s)) return no("characters");
    if (s.length !== 11) return no("length");
    const d = digitsOf(s);
    if (d[0] < 1 || d[0] > 8) return no("structure");
    const century = 1800 + Math.floor((d[0] - 1) / 2) * 100;
    if (
        !isCalendarDate(
            century + Number(s.slice(1, 3)),
            Number(s.slice(3, 5)),
            Number(s.slice(5, 7)),
        )
    )
        return no("date");
    let check = weightedSum(d, [1, 2, 3, 4, 5, 6, 7, 8, 9, 1]) % 11;
    if (check === 10) {
        check = weightedSum(d, [3, 4, 5, 6, 7, 8, 9, 1, 2, 3]) % 11;
        if (check === 10) check = 0;
    }
    return check === d[10] ? OK : no("checksum");
}

/**
 * The Czech and Slovak birth number (rodne cislo), YYMMDD/SSSC: nine digits for someone born before 1954 (no check), or ten
 * with the whole number divisible by 11 (a check of 0 stands for a remainder of 10 in the first nine, used up to 1985). The
 * month carries the sex (+50 for women) and, from 2004, +20 when the serials of a day ran out.
 */
export function validateRodneCislo(value: string): IdentifierResult {
    const s = stripSeparators(text(value, "validateRodneCislo"));
    if (!isDigits(s)) return no("characters");
    if (s.length !== 9 && s.length !== 10) return no("length");
    const yy = Number(s.slice(0, 2));
    let month = Number(s.slice(2, 4));
    const day = Number(s.slice(4, 6));
    if (s.length === 9 && yy >= 54) return no("structure");
    if (month > 50) month -= 50;
    if (month > 20) month -= 20;
    const year = s.length === 9 ? 1900 + yy : yy < 54 ? 2000 + yy : 1900 + yy;
    if (!isCalendarDate(year, month, day)) return no("date");
    if (s.length === 9) return OK;
    const first9 = Number(s.slice(0, 9));
    const check = Number(s[9]);
    return Number(s) % 11 === 0 || (first9 % 11 === 10 && check === 0) ? OK : no("checksum");
}

/** The Hungarian social security (TAJ) number: nine digits, the ninth the sum of the first eight times 3 and 7 alternately, modulo 10. */
export function validateMagyarorszagTajSzam(value: string): IdentifierResult {
    const s = stripSeparators(text(value, "validateMagyarorszagTajSzam"));
    if (!isDigits(s)) return no("characters");
    if (s.length !== 9) return no("length");
    const d = digitsOf(s);
    return weightedSum(d, [3, 7, 3, 7, 3, 7, 3, 7]) % 10 === d[8] ? OK : no("checksum");
}

/**
 * The Russian insurance number of individual ledger account (SNILS): eleven digits, the last two a check of the first nine
 * times 9 down to 1: the sum itself under 100, 0 for 100 or 101, otherwise the sum modulo 101 (with 100 again giving 0).
 */
export function validateRossiyaSnils(value: string): IdentifierResult {
    const s = stripSeparators(text(value, "validateRossiyaSnils").replace(/ /g, ""));
    if (!isDigits(s)) return no("characters");
    if (s.length !== 11) return no("length");
    const sum = weightedSum(digitsOf(s), [9, 8, 7, 6, 5, 4, 3, 2, 1]);
    const check = sum < 100 ? sum : sum % 101 === 100 ? 0 : sum % 101;
    return check === Number(s.slice(9)) ? OK : no("checksum");
}

const FINNISH_CHECK = "0123456789ABCDEFHJKLMNPRSTUVWXY";

/**
 * The Finnish personal identity code (henkilotunnus): DDMMYY, a century sign (+ for the 1800s; - and U to Y for the 1900s; A to
 * F for the 2000s), a three-digit individual number (002 to 899) and a check character, the nine digits DDMMYYZZZ as a number
 * modulo 31 looked up in 0123456789ABCDEFHJKLMNPRSTUVWXY. Letters are upper case; nothing is re-cased.
 */
export function validateSuomiHenkilotunnus(value: string): IdentifierResult {
    const s = text(value, "validateSuomiHenkilotunnus").replace(/ /g, "");
    if (!/^[0-9]{6}[+\-A-FU-Y][0-9]{3}[0-9A-Z]$/.test(s))
        return s.length !== 11 ? no("length") : no("characters");
    const sign = s[6];
    const century = sign === "+" ? 1800 : sign >= "A" && sign <= "F" ? 2000 : 1900;
    if (
        !isCalendarDate(
            century + Number(s.slice(4, 6)),
            Number(s.slice(2, 4)),
            Number(s.slice(0, 2)),
        )
    )
        return no("date");
    const serial = Number(s.slice(7, 10));
    if (serial < 2 || serial > 899) return no("structure");
    const n = Number(s.slice(0, 6) + s.slice(7, 10));
    return FINNISH_CHECK[n % 31] === s[10] ? OK : no("checksum");
}

const CF_ODD: Record<string, number> = {};
{
    const odd = [
        1, 0, 5, 7, 9, 13, 15, 17, 19, 21, 2, 4, 18, 20, 11, 3, 6, 8, 12, 14, 16, 10, 22, 25, 24,
        23,
    ];
    for (let i = 0; i < 10; i++) CF_ODD[String(i)] = odd[i];
    for (let i = 0; i < 26; i++) CF_ODD[String.fromCharCode(65 + i)] = odd[i];
}
const CF_OMOCODIA = "LMNPQRSTUV";
const CF_MONTHS = "ABCDEHLMPRST";

/**
 * The Italian tax code (codice fiscale) of a person: sixteen upper-case characters, surname and name letters, year, a month
 * letter (ABCDEHLMPRST), the day (plus 40 for a woman), the place code, and a check letter from the odd and even position
 * tables modulo 26. In a case of omocodia a digit is replaced by one of LMNPQRSTUV; it is read back before the date is checked.
 */
export function validateItaliaCodiceFiscale(value: string): IdentifierResult {
    const s = text(value, "validateItaliaCodiceFiscale").replace(/ /g, "");
    if (!/^[0-9A-Z]+$/.test(s)) return no("characters");
    if (s.length !== 16) return no("length");
    if (!/^[A-Z]{6}[0-9LMNPQRSTUV]{2}[A-Z][0-9LMNPQRSTUV]{2}[A-Z][0-9LMNPQRSTUV]{3}[A-Z]$/.test(s))
        return no("structure");
    const digit = (c: string) => (CF_OMOCODIA.includes(c) ? CF_OMOCODIA.indexOf(c) : Number(c));
    const month = CF_MONTHS.indexOf(s[8]) + 1;
    let day = digit(s[9]) * 10 + digit(s[10]);
    if (day > 40) day -= 40;
    if (month < 1 || day < 1 || day > maxDay(month)) return no("date");
    let sum = 0;
    for (let i = 0; i < 15; i++) {
        const c = s[i];
        sum += i % 2 === 0 ? CF_ODD[c] : /[0-9]/.test(c) ? Number(c) : c.charCodeAt(0) - 65;
    }
    return String.fromCharCode(65 + (sum % 26)) === s[15] ? OK : no("checksum");
}
