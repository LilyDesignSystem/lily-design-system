namespace LilyBlazorHeadless.Components;

/// <summary>Why a national identifier failed validation.</summary>
public enum IdentifierReason
{
    /// <summary>Characters that cannot appear in this identifier.</summary>
    Characters,
    /// <summary>The wrong number of characters.</summary>
    Length,
    /// <summary>The check digit or check letter does not match.</summary>
    Checksum,
    /// <summary>An embedded date of birth that is not a real calendar date.</summary>
    Date,
    /// <summary>Another structural rule of the scheme.</summary>
    Structure,
}

/// <summary>Valid, or invalid with the reason; a bad value is reported, never repaired.</summary>
public readonly record struct IdentifierResult(bool Valid, IdentifierReason? Reason)
{
    public static readonly IdentifierResult Ok = new(true, null);
    public static IdentifierResult Fail(IdentifierReason reason) => new(false, reason);
}

/// <summary>
/// Validation and check-digit logic for national personal identifiers (the C# twin of <c>shared/national-identifiers.ts</c>; the
/// same vectors test both). Pure functions. Separators (space, dot, dash, slash) are ignored; nothing else is trimmed, padded,
/// re-cased or defaulted. A <c>null</c> value throws <see cref="ArgumentNullException"/>.
/// </summary>
public static class NationalIdentifiers
{
    private static IdentifierResult Fail(IdentifierReason reason) => IdentifierResult.Fail(reason);

    /// <summary>The identifier with its separators (space, dot, dash, slash) removed.</summary>
    public static string StripSeparators(string value)
    {
        ArgumentNullException.ThrowIfNull(value);
        return new string(value.Where(c => c is not (' ' or '.' or '-' or '/')).ToArray());
    }

    private static bool IsDigits(string s) => s.Length > 0 && s.All(c => c is >= '0' and <= '9');
    private static int[] DigitsOf(string s) => s.Select(c => c - '0').ToArray();
    private static int WeightedSum(int[] digits, int[] weights) => weights.Select((w, i) => digits[i] * w).Sum();

    /// <summary>True when the whole number, check digit last, passes the Luhn check.</summary>
    public static bool LuhnValid(string digits)
    {
        ArgumentNullException.ThrowIfNull(digits);
        if (!IsDigits(digits)) return false;
        var sum = 0;
        var doubled = false;
        for (var i = digits.Length - 1; i >= 0; i--)
        {
            var d = digits[i] - '0';
            if (doubled) { d *= 2; if (d > 9) d -= 9; }
            sum += d;
            doubled = !doubled;
        }
        return sum % 10 == 0;
    }

    private static readonly int[,] VerhoeffD =
    {
        { 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 }, { 1, 2, 3, 4, 0, 6, 7, 8, 9, 5 }, { 2, 3, 4, 0, 1, 7, 8, 9, 5, 6 },
        { 3, 4, 0, 1, 2, 8, 9, 5, 6, 7 }, { 4, 0, 1, 2, 3, 9, 5, 6, 7, 8 }, { 5, 9, 8, 7, 6, 0, 4, 3, 2, 1 },
        { 6, 5, 9, 8, 7, 1, 0, 4, 3, 2 }, { 7, 6, 5, 9, 8, 2, 1, 0, 4, 3 }, { 8, 7, 6, 5, 9, 3, 2, 1, 0, 4 },
        { 9, 8, 7, 6, 5, 4, 3, 2, 1, 0 },
    };

    private static readonly int[,] VerhoeffP =
    {
        { 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 }, { 1, 5, 7, 6, 2, 8, 3, 0, 9, 4 }, { 5, 8, 0, 3, 7, 9, 6, 1, 4, 2 },
        { 8, 9, 1, 6, 0, 4, 3, 5, 2, 7 }, { 9, 4, 5, 3, 1, 2, 6, 8, 7, 0 }, { 4, 2, 8, 6, 5, 7, 3, 9, 0, 1 },
        { 2, 7, 9, 3, 8, 0, 6, 4, 1, 5 }, { 7, 0, 4, 6, 9, 1, 3, 2, 5, 8 },
    };

    /// <summary>True when the whole number, check digit last, passes the Verhoeff check.</summary>
    public static bool VerhoeffValid(string digits)
    {
        ArgumentNullException.ThrowIfNull(digits);
        if (!IsDigits(digits)) return false;
        var c = 0;
        var reversed = DigitsOf(digits).Reverse().ToArray();
        for (var i = 0; i < reversed.Length; i++) c = VerhoeffD[c, VerhoeffP[i % 8, reversed[i]]];
        return c == 0;
    }

    /// <summary>True when the year, month (1 to 12) and day name a real calendar day.</summary>
    public static bool IsCalendarDate(int year, int month, int day)
        => month is >= 1 and <= 12 && day >= 1 && year is >= 1 and <= 9999 && day <= DateTime.DaysInMonth(year, month);

    private static int Modulo(string digits, int n)
    {
        var r = 0;
        foreach (var c in digits) r = (r * 10 + (c - '0')) % n;
        return r;
    }

    /// <summary>NHS number (England, Wales, Isle of Man) and Northern Ireland Health and Care Number: ten digits, Modulus-11 check, weights 10 to 2; a check of 10 is never issued.</summary>
    public static IdentifierResult ValidateNhsNumber(string value)
    {
        var s = StripSeparators(value);
        if (!IsDigits(s)) return Fail(IdentifierReason.Characters);
        if (s.Length != 10) return Fail(IdentifierReason.Length);
        var d = DigitsOf(s);
        var remainder = WeightedSum(d, [10, 9, 8, 7, 6, 5, 4, 3, 2]) % 11;
        var check = remainder == 0 ? 0 : 11 - remainder;
        return check == 10 || check != d[9] ? Fail(IdentifierReason.Checksum) : IdentifierResult.Ok;
    }

    /// <summary>Canada Social Insurance Number: nine digits passing the Luhn check.</summary>
    public static IdentifierResult ValidateCanadaSocialInsuranceNumber(string value)
    {
        var s = StripSeparators(value);
        if (!IsDigits(s)) return Fail(IdentifierReason.Characters);
        if (s.Length != 9) return Fail(IdentifierReason.Length);
        return LuhnValid(s) ? IdentifierResult.Ok : Fail(IdentifierReason.Checksum);
    }

    /// <summary>Dutch BSN: nine digits satisfying the 11-proof (weights 9 to 2, then -1), not all zeros.</summary>
    public static IdentifierResult ValidateNederlandBurgerservicenummer(string value)
    {
        var s = StripSeparators(value);
        if (!IsDigits(s)) return Fail(IdentifierReason.Characters);
        if (s.Length != 9) return Fail(IdentifierReason.Length);
        var sum = WeightedSum(DigitsOf(s), [9, 8, 7, 6, 5, 4, 3, 2, -1]);
        return sum % 11 == 0 && sum != 0 ? IdentifierResult.Ok : Fail(IdentifierReason.Checksum);
    }

    /// <summary>Belgian National Register Number: eleven digits, key 97 minus the first nine modulo 97, with a leading 2 for those born in 2000 or later.</summary>
    public static IdentifierResult ValidateBelgiqueRegistreNational(string value)
    {
        var s = StripSeparators(value);
        if (!IsDigits(s)) return Fail(IdentifierReason.Characters);
        if (s.Length != 11) return Fail(IdentifierReason.Length);
        var month = int.Parse(s[2..4]);
        var day = int.Parse(s[4..6]);
        if (month > 12 && !(month is >= 20 and <= 32) && !(month is >= 40 and <= 52)) return Fail(IdentifierReason.Date);
        if (day > 31) return Fail(IdentifierReason.Date);
        if (int.Parse(s[6..9]) == 0) return Fail(IdentifierReason.Structure);
        var check = int.Parse(s[9..]);
        var baseNumber = long.Parse(s[..9]);
        return check == 97 - (int)(baseNumber % 97) || check == 97 - (int)((2_000_000_000L + baseNumber) % 97)
            ? IdentifierResult.Ok
            : Fail(IdentifierReason.Checksum);
    }

    /// <summary>Swedish personnummer: ten digits YYMMDDNNNC or twelve YYYYMMDDNNNC, Luhn over the ten-digit form, a real date (day + 60 for a samordningsnummer).</summary>
    public static IdentifierResult ValidateSverigePersonnummer(string value)
    {
        ArgumentNullException.ThrowIfNull(value);
        var s = StripSeparators(value.Replace("+", ""));
        if (!IsDigits(s)) return Fail(IdentifierReason.Characters);
        if (s.Length is not (10 or 12)) return Fail(IdentifierReason.Length);
        var ten = s.Length == 12 ? s[2..] : s;
        var mm = int.Parse(ten[2..4]);
        var dd = int.Parse(ten[4..6]);
        if (dd > 60) dd -= 60;
        var dateOk = s.Length == 12 ? IsCalendarDate(int.Parse(s[..4]), mm, dd) : mm is >= 1 and <= 12 && dd is >= 1 and <= 31;
        if (!dateOk) return Fail(IdentifierReason.Date);
        return LuhnValid(ten) ? IdentifierResult.Ok : Fail(IdentifierReason.Checksum);
    }

    /// <summary>Polish PESEL: eleven digits, YYMMDD with the century in the month, weights 1 3 7 9 1 3 7 9 1 3.</summary>
    public static IdentifierResult ValidatePolskaPesel(string value)
    {
        var s = StripSeparators(value);
        if (!IsDigits(s)) return Fail(IdentifierReason.Characters);
        if (s.Length != 11) return Fail(IdentifierReason.Length);
        var d = DigitsOf(s);
        var monthField = int.Parse(s[2..4]);
        var centuries = new[] { 1900, 2000, 2100, 2200, 1800 };
        var index = monthField / 20;
        if (index >= centuries.Length || !IsCalendarDate(centuries[index] + int.Parse(s[..2]), monthField % 20, int.Parse(s[4..6])))
            return Fail(IdentifierReason.Date);
        var check = (10 - WeightedSum(d, [1, 3, 7, 9, 1, 3, 7, 9, 1, 3]) % 10) % 10;
        return check == d[10] ? IdentifierResult.Ok : Fail(IdentifierReason.Checksum);
    }

    /// <summary>Australian Tax File Number: nine digits, weights 1 4 3 7 5 8 6 9 10, sum divisible by 11.</summary>
    public static IdentifierResult ValidateAustraliaTaxFileNumber(string value)
    {
        var s = StripSeparators(value);
        if (!IsDigits(s)) return Fail(IdentifierReason.Characters);
        if (s.Length != 9) return Fail(IdentifierReason.Length);
        return WeightedSum(DigitsOf(s), [1, 4, 3, 7, 5, 8, 6, 9, 10]) % 11 == 0 ? IdentifierResult.Ok : Fail(IdentifierReason.Checksum);
    }

    /// <summary>Indian Aadhaar: twelve digits, the first 2 to 9, a Verhoeff check.</summary>
    public static IdentifierResult ValidateBharatAadhaar(string value)
    {
        var s = StripSeparators(value);
        if (!IsDigits(s)) return Fail(IdentifierReason.Characters);
        if (s.Length != 12) return Fail(IdentifierReason.Length);
        if (s[0] is '0' or '1') return Fail(IdentifierReason.Structure);
        return VerhoeffValid(s) ? IdentifierResult.Ok : Fail(IdentifierReason.Checksum);
    }

    /// <summary>Swiss AHV number: thirteen digits starting 756, an EAN-13 check.</summary>
    public static IdentifierResult ValidateSchweizAhvNummer(string value)
    {
        var s = StripSeparators(value);
        if (!IsDigits(s)) return Fail(IdentifierReason.Characters);
        if (s.Length != 13) return Fail(IdentifierReason.Length);
        if (!s.StartsWith("756", StringComparison.Ordinal)) return Fail(IdentifierReason.Structure);
        var d = DigitsOf(s);
        var sum = d.Take(12).Select((n, i) => n * (i % 2 == 0 ? 1 : 3)).Sum();
        return (10 - sum % 10) % 10 == d[12] ? IdentifierResult.Ok : Fail(IdentifierReason.Checksum);
    }

    /// <summary>French NIR: fifteen characters, key 97 minus the 13-character body modulo 97, Corsica 2A as 19 and 2B as 18.</summary>
    public static IdentifierResult ValidateFranceNir(string value)
    {
        var s = StripSeparators(value).ToUpperInvariant();
        if (s.Length == 0 || !s.All(c => c is (>= '0' and <= '9') or 'A' or 'B')) return Fail(IdentifierReason.Characters);
        if (s.Length != 15) return Fail(IdentifierReason.Length);
        var department = s[5..7];
        var departmentOk = department.All(c => c is >= '0' and <= '9') || department is "2A" or "2B";
        if (!departmentOk || !s[..5].All(char.IsAsciiDigit) || !s[7..].All(char.IsAsciiDigit)) return Fail(IdentifierReason.Structure);
        var body = s[..13].Replace("2A", "19").Replace("2B", "18");
        return 97 - Modulo(body, 97) == int.Parse(s[13..]) ? IdentifierResult.Ok : Fail(IdentifierReason.Checksum);
    }

    /// <summary>Turkish TC Kimlik number: eleven digits, the first not 0, two check digits.</summary>
    public static IdentifierResult ValidateTurkiyeTcKimlikNumarasi(string value)
    {
        var s = StripSeparators(value);
        if (!IsDigits(s)) return Fail(IdentifierReason.Characters);
        if (s.Length != 11) return Fail(IdentifierReason.Length);
        if (s[0] == '0') return Fail(IdentifierReason.Structure);
        var d = DigitsOf(s);
        var odd = d[0] + d[2] + d[4] + d[6] + d[8];
        var even = d[1] + d[3] + d[5] + d[7];
        if (((odd * 7 - even) % 10 + 10) % 10 != d[9]) return Fail(IdentifierReason.Checksum);
        return d.Take(10).Sum() % 10 == d[10] ? IdentifierResult.Ok : Fail(IdentifierReason.Checksum);
    }

    // Modulus-11 and date-encoded identifiers (P43-T3, first family)

    private static int MaxDay(int month) => month == 2 ? 29 : month is 4 or 6 or 9 or 11 ? 30 : 31;

    /// <summary>Bulgarian EGN: ten digits, YYMMDD with the century in the month (+20 for the 1800s, +40 for the 2000s), weights 2 4 8 5 10 9 7 3 6 modulo 11 (10 gives 0).</summary>
    public static IdentifierResult ValidateBulgariaEdinenGrazhdanskiNomer(string value)
    {
        var s = StripSeparators(value);
        if (!IsDigits(s)) return Fail(IdentifierReason.Characters);
        if (s.Length != 10) return Fail(IdentifierReason.Length);
        var d = DigitsOf(s);
        var monthField = int.Parse(s[2..4]);
        var century = monthField > 40 ? 2000 : monthField > 20 ? 1800 : 1900;
        var month = monthField - (century == 2000 ? 40 : century == 1800 ? 20 : 0);
        var day = int.Parse(s[4..6]);
        if (month is < 1 or > 12 || day < 1 || !IsCalendarDate(century + int.Parse(s[..2]), month, day)) return Fail(IdentifierReason.Date);
        return WeightedSum(d, [2, 4, 8, 5, 10, 9, 7, 3, 6]) % 11 % 10 == d[9] ? IdentifierResult.Ok : Fail(IdentifierReason.Checksum);
    }

    /// <summary>Norwegian fodselsnummer: eleven digits, DDMMYY, an individual number and two Modulus-11 checks (a check of 10 is never issued; a D-number adds 40 to the day, an H-number 40 to the month).</summary>
    public static IdentifierResult ValidateNorgeFodselsnummer(string value)
    {
        var s = StripSeparators(value);
        if (!IsDigits(s)) return Fail(IdentifierReason.Characters);
        if (s.Length != 11) return Fail(IdentifierReason.Length);
        var d = DigitsOf(s);
        var day = int.Parse(s[..2]);
        var month = int.Parse(s[2..4]);
        if (day > 40) day -= 40;
        if (month > 40) month -= 40;
        var yy = int.Parse(s[4..6]);
        var serial = int.Parse(s[6..9]);
        var century = serial < 500 ? 1900 : serial < 750 && yy >= 54 ? 1800 : serial >= 900 && yy >= 40 ? 1900 : yy < 40 ? 2000 : 0;
        if (century == 0 || !IsCalendarDate(century + yy, month, day)) return Fail(IdentifierReason.Date);
        var first = 11 - WeightedSum(d, [3, 7, 6, 1, 8, 9, 4, 5, 2]) % 11;
        var k1 = first == 11 ? 0 : first;
        var second = 11 - WeightedSum(d, [5, 4, 3, 2, 7, 6, 5, 4, 3, 2]) % 11;
        var k2 = second == 11 ? 0 : second;
        return k1 == d[9] && k2 == d[10] && k1 != 10 && k2 != 10 ? IdentifierResult.Ok : Fail(IdentifierReason.Checksum);
    }

    /// <summary>Estonian isikukood: eleven digits, century-and-sex digit 1 to 8, YYMMDD, serial, a check from weights 1 2 3 4 5 6 7 8 9 1 modulo 11, else 3 4 5 6 7 8 9 1 2 3 (else 0).</summary>
    public static IdentifierResult ValidateEestiIsikukood(string value)
    {
        var s = StripSeparators(value);
        if (!IsDigits(s)) return Fail(IdentifierReason.Characters);
        if (s.Length != 11) return Fail(IdentifierReason.Length);
        var d = DigitsOf(s);
        if (d[0] is < 1 or > 8) return Fail(IdentifierReason.Structure);
        var century = 1800 + (d[0] - 1) / 2 * 100;
        if (!IsCalendarDate(century + int.Parse(s[1..3]), int.Parse(s[3..5]), int.Parse(s[5..7]))) return Fail(IdentifierReason.Date);
        var check = WeightedSum(d, [1, 2, 3, 4, 5, 6, 7, 8, 9, 1]) % 11;
        if (check == 10)
        {
            check = WeightedSum(d, [3, 4, 5, 6, 7, 8, 9, 1, 2, 3]) % 11;
            if (check == 10) check = 0;
        }
        return check == d[10] ? IdentifierResult.Ok : Fail(IdentifierReason.Checksum);
    }

    /// <summary>Czech and Slovak rodne cislo: nine digits before 1954 (no check) or ten with the whole number divisible by 11 (a check of 0 for a remainder of 10 in the first nine); month +50 for women, +20 when serials ran out.</summary>
    public static IdentifierResult ValidateRodneCislo(string value)
    {
        var s = StripSeparators(value);
        if (!IsDigits(s)) return Fail(IdentifierReason.Characters);
        if (s.Length is not (9 or 10)) return Fail(IdentifierReason.Length);
        var yy = int.Parse(s[..2]);
        var month = int.Parse(s[2..4]);
        var day = int.Parse(s[4..6]);
        if (s.Length == 9 && yy >= 54) return Fail(IdentifierReason.Structure);
        if (month > 50) month -= 50;
        if (month > 20) month -= 20;
        var year = s.Length == 9 ? 1900 + yy : yy < 54 ? 2000 + yy : 1900 + yy;
        if (!IsCalendarDate(year, month, day)) return Fail(IdentifierReason.Date);
        if (s.Length == 9) return IdentifierResult.Ok;
        var first9 = long.Parse(s[..9]);
        return long.Parse(s) % 11 == 0 || (first9 % 11 == 10 && s[9] == '0') ? IdentifierResult.Ok : Fail(IdentifierReason.Checksum);
    }

    /// <summary>Hungarian TAJ number: nine digits, the ninth the first eight times 3 and 7 alternately, modulo 10.</summary>
    public static IdentifierResult ValidateMagyarorszagTajSzam(string value)
    {
        var s = StripSeparators(value);
        if (!IsDigits(s)) return Fail(IdentifierReason.Characters);
        if (s.Length != 9) return Fail(IdentifierReason.Length);
        var d = DigitsOf(s);
        return WeightedSum(d, [3, 7, 3, 7, 3, 7, 3, 7]) % 10 == d[8] ? IdentifierResult.Ok : Fail(IdentifierReason.Checksum);
    }

    /// <summary>Russian SNILS: eleven digits, the last two a check of the first nine times 9 down to 1 (under 100 as is, 100 or 101 as 00, else modulo 101 with 100 as 00).</summary>
    public static IdentifierResult ValidateRossiyaSnils(string value)
    {
        var s = StripSeparators(value.Replace(" ", ""));
        if (!IsDigits(s)) return Fail(IdentifierReason.Characters);
        if (s.Length != 11) return Fail(IdentifierReason.Length);
        var sum = WeightedSum(DigitsOf(s), [9, 8, 7, 6, 5, 4, 3, 2, 1]);
        var check = sum < 100 ? sum : sum % 101 == 100 ? 0 : sum % 101;
        return check == int.Parse(s[9..]) ? IdentifierResult.Ok : Fail(IdentifierReason.Checksum);
    }

    private const string FinnishCheck = "0123456789ABCDEFHJKLMNPRSTUVWXY";

    /// <summary>Finnish henkilotunnus: DDMMYY, a century sign (+, -, U to Y, A to F), a serial 002 to 899, and a check character (the nine digits modulo 31); upper case only.</summary>
    public static IdentifierResult ValidateSuomiHenkilotunnus(string value)
    {
        ArgumentNullException.ThrowIfNull(value);
        var s = value.Replace(" ", "");
        var shape = System.Text.RegularExpressions.Regex.IsMatch(s, "^[0-9]{6}[+\\-A-FU-Y][0-9]{3}[0-9A-Z]$");
        if (!shape) return Fail(s.Length != 11 ? IdentifierReason.Length : IdentifierReason.Characters);
        var century = s[6] == '+' ? 1800 : s[6] is >= 'A' and <= 'F' ? 2000 : 1900;
        if (!IsCalendarDate(century + int.Parse(s[4..6]), int.Parse(s[2..4]), int.Parse(s[..2]))) return Fail(IdentifierReason.Date);
        var serial = int.Parse(s[7..10]);
        if (serial is < 2 or > 899) return Fail(IdentifierReason.Structure);
        var n = long.Parse(s[..6] + s[7..10]);
        return FinnishCheck[(int)(n % 31)] == s[10] ? IdentifierResult.Ok : Fail(IdentifierReason.Checksum);
    }

    private static readonly int[] CfOdd = [1, 0, 5, 7, 9, 13, 15, 17, 19, 21, 2, 4, 18, 20, 11, 3, 6, 8, 12, 14, 16, 10, 22, 25, 24, 23];

    /// <summary>Italian codice fiscale of a person: sixteen upper-case characters, a month letter (ABCDEHLMPRST), a day (+40 for women), omocodia letters LMNPQRSTUV for digits, a check letter from the odd and even tables modulo 26.</summary>
    public static IdentifierResult ValidateItaliaCodiceFiscale(string value)
    {
        ArgumentNullException.ThrowIfNull(value);
        var s = value.Replace(" ", "");
        if (s.Length == 0 || !s.All(c => c is (>= '0' and <= '9') or (>= 'A' and <= 'Z'))) return Fail(IdentifierReason.Characters);
        if (s.Length != 16) return Fail(IdentifierReason.Length);
        if (!System.Text.RegularExpressions.Regex.IsMatch(s, "^[A-Z]{6}[0-9LMNPQRSTUV]{2}[A-Z][0-9LMNPQRSTUV]{2}[A-Z][0-9LMNPQRSTUV]{3}[A-Z]$"))
            return Fail(IdentifierReason.Structure);
        const string omocodia = "LMNPQRSTUV";
        static int Digit(char c) => omocodia.Contains(c) ? omocodia.IndexOf(c) : c - '0';
        var month = "ABCDEHLMPRST".IndexOf(s[8]) + 1;
        var day = Digit(s[9]) * 10 + Digit(s[10]);
        if (day > 40) day -= 40;
        if (month < 1 || day < 1 || day > MaxDay(month)) return Fail(IdentifierReason.Date);
        var sum = 0;
        for (var i = 0; i < 15; i++)
        {
            var c = s[i];
            sum += i % 2 == 0 ? CfOdd[char.IsAsciiDigit(c) ? c - '0' : c - 'A'] : char.IsAsciiDigit(c) ? c - '0' : c - 'A';
        }
        return (char)('A' + sum % 26) == s[15] ? IdentifierResult.Ok : Fail(IdentifierReason.Checksum);
    }

    // Latin American, Asian, African and further European identifiers (P43-T3, second family)

    /// <summary>Portuguese NIF: nine digits, the ninth 11 minus the first eight (weights 9 to 2) modulo 11, 0 when that is 10 or 11.</summary>
    public static IdentifierResult ValidatePortugalNumeroDeIdentificacaoFiscal(string value)
    {
        var s = StripSeparators(value);
        if (!IsDigits(s)) return Fail(IdentifierReason.Characters);
        if (s.Length != 9) return Fail(IdentifierReason.Length);
        var d = DigitsOf(s);
        var check = 11 - WeightedSum(d, [9, 8, 7, 6, 5, 4, 3, 2]) % 11;
        return (check >= 10 ? 0 : check) == d[8] ? IdentifierResult.Ok : Fail(IdentifierReason.Checksum);
    }

    /// <summary>Chilean RUT: one to eight digits and a check digit or K, weights 2 to 7 from the right.</summary>
    public static IdentifierResult ValidateChileRolUnicoNacional(string value)
    {
        var s = StripSeparators(value);
        if (s.Length == 0 || !s.All(c => c is (>= '0' and <= '9') or 'K') || s[..^1].Contains('K')) return Fail(IdentifierReason.Characters);
        if (s.Length is < 2 or > 9) return Fail(IdentifierReason.Length);
        var body = DigitsOf(s[..^1]).Reverse().ToArray();
        var sum = body.Select((n, i) => n * (2 + i % 6)).Sum();
        var check = 11 - sum % 11;
        var expected = check == 11 ? '0' : check == 10 ? 'K' : (char)('0' + check);
        return expected == s[^1] ? IdentifierResult.Ok : Fail(IdentifierReason.Checksum);
    }

    /// <summary>Uruguayan cedula: six or seven digits and a check digit, the digits (left-padded to seven) times 2 9 8 7 6 3 4.</summary>
    public static IdentifierResult ValidateUruguayCedulaDeIdentidad(string value)
    {
        var s = StripSeparators(value);
        if (!IsDigits(s)) return Fail(IdentifierReason.Characters);
        if (s.Length is not (7 or 8)) return Fail(IdentifierReason.Length);
        var body = DigitsOf(s[..^1].PadLeft(7, '0'));
        return (10 - WeightedSum(body, [2, 9, 8, 7, 6, 3, 4]) % 10) % 10 == s[^1] - '0' ? IdentifierResult.Ok : Fail(IdentifierReason.Checksum);
    }

    /// <summary>Ecuadorian cedula: ten digits, a province 01 to 24 or 30, a third digit under 6, a check from weights 2 1 2 1 2 1 2 1 2.</summary>
    public static IdentifierResult ValidateEcuadorCedulaDeIdentidad(string value)
    {
        var s = StripSeparators(value);
        if (!IsDigits(s)) return Fail(IdentifierReason.Characters);
        if (s.Length != 10) return Fail(IdentifierReason.Length);
        var d = DigitsOf(s);
        var province = int.Parse(s[..2]);
        if (!(province is >= 1 and <= 24 || province == 30) || d[2] > 5) return Fail(IdentifierReason.Structure);
        var sum = d.Take(9).Select((n, i) => { var p = n * (i % 2 == 0 ? 2 : 1); return p > 9 ? p - 9 : p; }).Sum();
        return (10 - sum % 10) % 10 == d[9] ? IdentifierResult.Ok : Fail(IdentifierReason.Checksum);
    }

    /// <summary>Argentine CUIL or CUIT: eleven digits, a prefix 20, 23, 24, 27, 30, 33 or 34, weights 5 4 3 2 7 6 5 4 3 2; a check of 10 is never issued.</summary>
    public static IdentifierResult ValidateArgentinaCodigoUnicoDeIdentificacionLaboral(string value)
    {
        var s = StripSeparators(value);
        if (!IsDigits(s)) return Fail(IdentifierReason.Characters);
        if (s.Length != 11) return Fail(IdentifierReason.Length);
        if (!new[] { "20", "23", "24", "27", "30", "33", "34" }.Contains(s[..2])) return Fail(IdentifierReason.Structure);
        var d = DigitsOf(s);
        var check = 11 - WeightedSum(d, [5, 4, 3, 2, 7, 6, 5, 4, 3, 2]) % 11;
        var expected = check == 11 ? 0 : check;
        return expected != 10 && expected == d[10] ? IdentifierResult.Ok : Fail(IdentifierReason.Checksum);
    }

    private const string CurpAlphabet = "0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";

    /// <summary>Mexican CURP: eighteen characters, YYMMDD, a sex letter H, M or X, and a check digit from the position-weighted alphabet values.</summary>
    public static IdentifierResult ValidateMexicoClaveUnicaDeRegistroDePoblacion(string value)
    {
        ArgumentNullException.ThrowIfNull(value);
        var s = value;
        if (s.Length == 0 || !s.All(c => CurpAlphabet.Contains(c))) return Fail(IdentifierReason.Characters);
        if (s.Length != 18) return Fail(IdentifierReason.Length);
        if (!System.Text.RegularExpressions.Regex.IsMatch(s, "^[A-Z]{4}[0-9]{6}[HMX][A-Z]{5}[0-9A-Z][0-9]$")) return Fail(IdentifierReason.Structure);
        var month = int.Parse(s[6..8]);
        var day = int.Parse(s[8..10]);
        if (month is < 1 or > 12 || day < 1 || day > MaxDay(month)) return Fail(IdentifierReason.Date);
        var sum = 0;
        for (var i = 0; i < 17; i++) sum += CurpAlphabet.IndexOf(s[i]) * (18 - i);
        return (10 - sum % 10) % 10 == s[17] - '0' ? IdentifierResult.Ok : Fail(IdentifierReason.Checksum);
    }

    /// <summary>South African identity number: thirteen digits, YYMMDD, a citizenship digit 0 or 1, a Luhn check.</summary>
    public static IdentifierResult ValidateSouthAfricaIdentityNumber(string value)
    {
        var s = StripSeparators(value);
        if (!IsDigits(s)) return Fail(IdentifierReason.Characters);
        if (s.Length != 13) return Fail(IdentifierReason.Length);
        var month = int.Parse(s[2..4]);
        var day = int.Parse(s[4..6]);
        if (month is < 1 or > 12 || day < 1 || day > MaxDay(month)) return Fail(IdentifierReason.Date);
        if (s[10] is not ('0' or '1')) return Fail(IdentifierReason.Structure);
        return LuhnValid(s) ? IdentifierResult.Ok : Fail(IdentifierReason.Checksum);
    }

    /// <summary>Singapore NRIC or FIN: a prefix S, T, F or G, seven digits and a check letter.</summary>
    public static IdentifierResult ValidateSingaporeNationalRegistrationIdentityCard(string value)
    {
        var s = StripSeparators(value);
        if (s.Length == 0 || !s.All(c => c is (>= '0' and <= '9') or (>= 'A' and <= 'Z'))) return Fail(IdentifierReason.Characters);
        if (s.Length != 9) return Fail(IdentifierReason.Length);
        if (!System.Text.RegularExpressions.Regex.IsMatch(s, "^[STFG][0-9]{7}[A-Z]$")) return Fail(IdentifierReason.Structure);
        var sum = WeightedSum(DigitsOf(s[1..8]), [2, 7, 6, 5, 4, 3, 2]) + (s[0] is 'T' or 'G' ? 4 : 0);
        var table = s[0] is 'S' or 'T' ? "JZIHGFEDCBA" : "XWUTRQPNMLK";
        return table[sum % 11] == s[8] ? IdentifierResult.Ok : Fail(IdentifierReason.Checksum);
    }

    private const string TaiwanLetters = "ABCDEFGHJKLMNPQRSTUVXYWZIO";

    /// <summary>Taiwanese national identification number: a letter, a digit 1, 2, 8 or 9, eight digits; the weighted sum is divisible by 10.</summary>
    public static IdentifierResult ValidateTaiwanGuominShenfenzhengTongyiBianhao(string value)
    {
        var s = StripSeparators(value);
        if (s.Length == 0 || !s.All(c => c is (>= '0' and <= '9') or (>= 'A' and <= 'Z'))) return Fail(IdentifierReason.Characters);
        if (s.Length != 10) return Fail(IdentifierReason.Length);
        if (!System.Text.RegularExpressions.Regex.IsMatch(s, "^[A-Z][1289][0-9]{8}$")) return Fail(IdentifierReason.Structure);
        var code = TaiwanLetters.IndexOf(s[0]) + 10;
        var d = DigitsOf(s[1..]);
        var sum = code / 10 + code % 10 * 9 + WeightedSum(d, [8, 7, 6, 5, 4, 3, 2, 1]) + d[8];
        return sum % 10 == 0 ? IdentifierResult.Ok : Fail(IdentifierReason.Checksum);
    }

    /// <summary>Japanese Individual Number (My Number): twelve digits, the last a check of the first eleven weighted 2 to 7 then 2 to 6 from the right.</summary>
    public static IdentifierResult ValidateNihonKojinBango(string value)
    {
        var s = StripSeparators(value);
        if (!IsDigits(s)) return Fail(IdentifierReason.Characters);
        if (s.Length != 12) return Fail(IdentifierReason.Length);
        var body = DigitsOf(s[..11]).Reverse().ToArray();
        var sum = body.Select((n, i) => n * (i < 6 ? i + 2 : i - 4)).Sum();
        var remainder = sum % 11;
        return (remainder <= 1 ? 0 : 11 - remainder) == s[11] - '0' ? IdentifierResult.Ok : Fail(IdentifierReason.Checksum);
    }

    /// <summary>Chinese resident identity card number: eighteen characters, a birth date, and a check digit or X.</summary>
    public static IdentifierResult ValidateZhongguoJuminShenfenzhengHaoma(string value)
    {
        ArgumentNullException.ThrowIfNull(value);
        var s = value;
        if (s.Length == 0 || !s[..^1].All(char.IsAsciiDigit) || !(char.IsAsciiDigit(s[^1]) || s[^1] == 'X')) return Fail(IdentifierReason.Characters);
        if (s.Length != 18) return Fail(IdentifierReason.Length);
        if (!IsCalendarDate(int.Parse(s[6..10]), int.Parse(s[10..12]), int.Parse(s[12..14]))) return Fail(IdentifierReason.Date);
        var sum = WeightedSum(DigitsOf(s[..17]), [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]);
        return "10X98765432"[sum % 11] == s[17] ? IdentifierResult.Ok : Fail(IdentifierReason.Checksum);
    }

    /// <summary>Latvian personal code: eleven digits; a code beginning 32 carries no date or check; an older one has a date, a century digit 0 to 2 and a check.</summary>
    public static IdentifierResult ValidateLatvijaPersonasKods(string value)
    {
        var s = StripSeparators(value);
        if (!IsDigits(s)) return Fail(IdentifierReason.Characters);
        if (s.Length != 11) return Fail(IdentifierReason.Length);
        if (s.StartsWith("32", StringComparison.Ordinal)) return IdentifierResult.Ok;
        var d = DigitsOf(s);
        if (d[6] > 2) return Fail(IdentifierReason.Structure);
        if (!IsCalendarDate(1800 + d[6] * 100 + int.Parse(s[4..6]), int.Parse(s[2..4]), int.Parse(s[..2]))) return Fail(IdentifierReason.Date);
        var check = (1101 - WeightedSum(d, [1, 6, 3, 7, 9, 10, 5, 8, 4, 2])) % 11 % 10;
        return check == d[10] ? IdentifierResult.Ok : Fail(IdentifierReason.Checksum);
    }

    /// <summary>Lithuanian asmens kodas: eleven digits with the Estonian layout (century-and-sex digit 1 to 6) and the same two-pass Modulus-11 check.</summary>
    public static IdentifierResult ValidateLietuvaAsmensKodas(string value)
    {
        var s = StripSeparators(value);
        if (!IsDigits(s)) return Fail(IdentifierReason.Characters);
        if (s.Length != 11) return Fail(IdentifierReason.Length);
        var d = DigitsOf(s);
        if (d[0] is < 1 or > 6) return Fail(IdentifierReason.Structure);
        if (!IsCalendarDate(1800 + (d[0] - 1) / 2 * 100 + int.Parse(s[1..3]), int.Parse(s[3..5]), int.Parse(s[5..7]))) return Fail(IdentifierReason.Date);
        var check = WeightedSum(d, [1, 2, 3, 4, 5, 6, 7, 8, 9, 1]) % 11;
        if (check == 10)
        {
            check = WeightedSum(d, [3, 4, 5, 6, 7, 8, 9, 1, 2, 3]) % 11;
            if (check == 10) check = 0;
        }
        return check == d[10] ? IdentifierResult.Ok : Fail(IdentifierReason.Checksum);
    }

    // Further identifiers (P43-T3, third family)

    /// <summary>Croatian OIB: eleven digits, the last the ISO 7064 MOD 11,10 check of the first ten.</summary>
    public static IdentifierResult ValidateHrvatskaOsobniIdentifikacijskiBroj(string value)
    {
        var s = StripSeparators(value);
        if (!IsDigits(s)) return Fail(IdentifierReason.Characters);
        if (s.Length != 11) return Fail(IdentifierReason.Length);
        var a = 10;
        foreach (var n in DigitsOf(s[..10]))
        {
            a = (a + n) % 10;
            if (a == 0) a = 10;
            a = a * 2 % 11;
        }
        var check = 11 - a == 10 ? 0 : 11 - a;
        return check == s[10] - '0' ? IdentifierResult.Ok : Fail(IdentifierReason.Checksum);
    }

    /// <summary>Slovenian EMSO: thirteen digits, DDMMYYY, a region and serial, a check from weights 7 6 5 4 3 2 7 6 5 4 3 2 (10 is never issued).</summary>
    public static IdentifierResult ValidateSlovenijaEmso(string value)
    {
        var s = StripSeparators(value);
        if (!IsDigits(s)) return Fail(IdentifierReason.Characters);
        if (s.Length != 13) return Fail(IdentifierReason.Length);
        var d = DigitsOf(s);
        var yyy = int.Parse(s[4..7]);
        if (!IsCalendarDate(yyy < 100 ? 2000 + yyy : 1000 + yyy, int.Parse(s[2..4]), int.Parse(s[..2]))) return Fail(IdentifierReason.Date);
        var check = 11 - WeightedSum(d, [7, 6, 5, 4, 3, 2, 7, 6, 5, 4, 3, 2]) % 11;
        var expected = check == 11 ? 0 : check;
        return expected != 10 && expected == d[12] ? IdentifierResult.Ok : Fail(IdentifierReason.Checksum);
    }

    /// <summary>Romanian CNP: thirteen digits, sex-and-century digit, YYMMDD, county 01 to 46, 51 or 52, and a check from weights 2 7 9 1 4 6 3 5 8 2 7 9 (10 gives 1).</summary>
    public static IdentifierResult ValidateRomaniaCodNumericPersonal(string value)
    {
        var s = StripSeparators(value);
        if (!IsDigits(s)) return Fail(IdentifierReason.Characters);
        if (s.Length != 13) return Fail(IdentifierReason.Length);
        var d = DigitsOf(s);
        if (d[0] == 0) return Fail(IdentifierReason.Structure);
        var county = int.Parse(s[7..9]);
        if (!(county is >= 1 and <= 46 || county is 51 or 52)) return Fail(IdentifierReason.Structure);
        var month = int.Parse(s[3..5]);
        var day = int.Parse(s[5..7]);
        var century = new[] { 0, 1900, 1900, 1800, 1800, 2000, 2000 }.ElementAtOrDefault(d[0]);
        var dateOk = century != 0
            ? IsCalendarDate(century + int.Parse(s[1..3]), month, day)
            : month is >= 1 and <= 12 && day >= 1 && day <= MaxDay(month);
        if (!dateOk) return Fail(IdentifierReason.Date);
        var remainder = WeightedSum(d, [2, 7, 9, 1, 4, 6, 3, 5, 8, 2, 7, 9]) % 11;
        return (remainder == 10 ? 1 : remainder) == d[12] ? IdentifierResult.Ok : Fail(IdentifierReason.Checksum);
    }

    /// <summary>Austrian social security number: ten digits, a serial, a check digit (weights 3 7 9 5 8 4 2 1 6 over the other nine, modulo 11) and DDMMYY.</summary>
    public static IdentifierResult ValidateOsterreichSozialversicherungsnummer(string value)
    {
        var s = StripSeparators(value);
        if (!IsDigits(s)) return Fail(IdentifierReason.Characters);
        if (s.Length != 10) return Fail(IdentifierReason.Length);
        var d = DigitsOf(s);
        if (d[0] == 0) return Fail(IdentifierReason.Structure);
        var day = int.Parse(s[4..6]);
        var month = int.Parse(s[6..8]);
        if (month is < 1 or > 12 || day < 1 || day > MaxDay(month)) return Fail(IdentifierReason.Date);
        var remainder = WeightedSum(d, [3, 7, 9, 0, 5, 8, 4, 2, 1, 6]) % 11;
        return remainder != 10 && remainder == d[3] ? IdentifierResult.Ok : Fail(IdentifierReason.Checksum);
    }

    /// <summary>Icelandic kennitala: ten digits, DDMMYY (a company's day has 40 added), two random digits, a check digit, a century digit 8, 9 or 0.</summary>
    public static IdentifierResult ValidateIslandKennitala(string value)
    {
        var s = StripSeparators(value);
        if (!IsDigits(s)) return Fail(IdentifierReason.Characters);
        if (s.Length != 10) return Fail(IdentifierReason.Length);
        var d = DigitsOf(s);
        if (d[9] is not (8 or 9 or 0)) return Fail(IdentifierReason.Structure);
        var day = int.Parse(s[..2]);
        if (day > 40) day -= 40;
        var year = (d[9] == 8 ? 1800 : d[9] == 9 ? 1900 : 2000) + int.Parse(s[4..6]);
        if (!IsCalendarDate(year, int.Parse(s[2..4]), day)) return Fail(IdentifierReason.Date);
        var check = 11 - WeightedSum(d, [3, 2, 7, 6, 5, 4, 3, 2]) % 11;
        var expected = check == 11 ? 0 : check;
        return expected != 10 && expected == d[8] ? IdentifierResult.Ok : Fail(IdentifierReason.Checksum);
    }

    /// <summary>Israeli teudat zehut: nine digits (not padded), alternately times 1 and 2 with each product's digits added, total divisible by 10.</summary>
    public static IdentifierResult ValidateYisraelTeudatZehut(string value)
    {
        var s = StripSeparators(value);
        if (!IsDigits(s)) return Fail(IdentifierReason.Characters);
        if (s.Length != 9) return Fail(IdentifierReason.Length);
        var total = DigitsOf(s).Select((n, i) => { var p = n * (i % 2 == 0 ? 1 : 2); return p > 9 ? p - 9 : p; }).Sum();
        return total % 10 == 0 ? IdentifierResult.Ok : Fail(IdentifierReason.Checksum);
    }

    /// <summary>Iranian kod-e melli: ten digits, not one digit repeated, a check from the first nine times 10 down to 2 modulo 11.</summary>
    public static IdentifierResult ValidateIranKodEMelli(string value)
    {
        var s = StripSeparators(value);
        if (!IsDigits(s)) return Fail(IdentifierReason.Characters);
        if (s.Length != 10) return Fail(IdentifierReason.Length);
        if (s.Distinct().Count() == 1) return Fail(IdentifierReason.Structure);
        var d = DigitsOf(s);
        var remainder = WeightedSum(d, [10, 9, 8, 7, 6, 5, 4, 3, 2]) % 11;
        return (remainder < 2 ? remainder : 11 - remainder) == d[9] ? IdentifierResult.Ok : Fail(IdentifierReason.Checksum);
    }

    /// <summary>United Arab Emirates Emirates ID: fifteen digits beginning 784 and a Luhn check.</summary>
    public static IdentifierResult ValidateAlImaratRaqmAlHuwiyah(string value)
    {
        var s = StripSeparators(value);
        if (!IsDigits(s)) return Fail(IdentifierReason.Characters);
        if (s.Length != 15) return Fail(IdentifierReason.Length);
        if (!s.StartsWith("784", StringComparison.Ordinal)) return Fail(IdentifierReason.Structure);
        return LuhnValid(s) ? IdentifierResult.Ok : Fail(IdentifierReason.Checksum);
    }

    /// <summary>Hong Kong identity card number: one or two letters, six digits and a check digit or A (brackets ignored).</summary>
    public static IdentifierResult ValidateHongKongIdentityCard(string value)
    {
        var s = StripSeparators(value).Replace("(", "").Replace(")", "");
        if (s.Length == 0 || !s.All(c => c is (>= '0' and <= '9') or (>= 'A' and <= 'Z'))) return Fail(IdentifierReason.Characters);
        if (!System.Text.RegularExpressions.Regex.IsMatch(s, "^[A-Z]{1,2}[0-9]{6}[0-9A]$")) return Fail(s.Length is < 8 or > 9 ? IdentifierReason.Length : IdentifierReason.Structure);
        var letters = s.TakeWhile(char.IsAsciiLetter).ToArray();
        var values = new List<int> { letters.Length == 1 ? 36 : letters[0] - 55, letters[^1] - 55 };
        values.AddRange(s.Skip(letters.Length).Take(6).Select(c => c - '0'));
        var sum = values.Select((n, i) => n * (9 - i)).Sum();
        var check = 11 - sum % 11;
        var expected = check == 11 ? '0' : check == 10 ? 'A' : (char)('0' + check);
        return expected == s[^1] ? IdentifierResult.Ok : Fail(IdentifierReason.Checksum);
    }

    /// <summary>Thai national identification number: thirteen digits, the last (11 minus the first twelve times 13 down to 2, modulo 11) modulo 10.</summary>
    public static IdentifierResult ValidatePrathetThaiLekPrajamTuaPrachachon(string value)
    {
        var s = StripSeparators(value);
        if (!IsDigits(s)) return Fail(IdentifierReason.Characters);
        if (s.Length != 13) return Fail(IdentifierReason.Length);
        var d = DigitsOf(s);
        var sum = d.Take(12).Select((n, i) => n * (13 - i)).Sum();
        return (11 - sum % 11) % 10 == d[12] ? IdentifierResult.Ok : Fail(IdentifierReason.Checksum);
    }
}
