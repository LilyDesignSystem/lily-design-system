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
}
