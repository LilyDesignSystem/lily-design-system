using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

// The same vectors as shared/national-identifiers.test.ts.
public class NationalIdentifiersTests
{
    private static readonly IdentifierResult Ok = IdentifierResult.Ok;
    private static IdentifierResult Bad(IdentifierReason reason) => IdentifierResult.Fail(reason);

    [Fact]
    public void Primitives()
    {
        Assert.Equal("9434765919xy", NationalIdentifiers.StripSeparators("943 476-5919.x/y"));
        Assert.True(NationalIdentifiers.LuhnValid("79927398713"));
        Assert.False(NationalIdentifiers.LuhnValid("79927398710"));
        Assert.False(NationalIdentifiers.LuhnValid(""));
        Assert.True(NationalIdentifiers.VerhoeffValid("2363"));
        Assert.False(NationalIdentifiers.VerhoeffValid("2364"));
        Assert.True(NationalIdentifiers.IsCalendarDate(2024, 2, 29));
        Assert.False(NationalIdentifiers.IsCalendarDate(2023, 2, 29));
        Assert.False(NationalIdentifiers.IsCalendarDate(1900, 2, 29));
        Assert.True(NationalIdentifiers.IsCalendarDate(2000, 2, 29));
        Assert.False(NationalIdentifiers.IsCalendarDate(2024, 13, 1));
        Assert.False(NationalIdentifiers.IsCalendarDate(2024, 1, 0));
    }

    [Fact]
    public void A_null_value_throws()
    {
        Assert.Throws<ArgumentNullException>(() => NationalIdentifiers.ValidateNhsNumber(null!));
        Assert.Throws<ArgumentNullException>(() => NationalIdentifiers.ValidateSverigePersonnummer(null!));
        Assert.Throws<ArgumentNullException>(() => NationalIdentifiers.LuhnValid(null!));
    }

    [Fact]
    public void NhsNumber()
    {
        Assert.Equal(Ok, NationalIdentifiers.ValidateNhsNumber("943 476 5919"));
        Assert.Equal(Ok, NationalIdentifiers.ValidateNhsNumber("943 476 5900"));
        Assert.Equal(Ok, NationalIdentifiers.ValidateNhsNumber("999 999 9999"));
        Assert.Equal(Bad(IdentifierReason.Checksum), NationalIdentifiers.ValidateNhsNumber("943 476 5918"));
        Assert.Equal(Bad(IdentifierReason.Checksum), NationalIdentifiers.ValidateNhsNumber("943 476 5960"));
        Assert.Equal(Bad(IdentifierReason.Length), NationalIdentifiers.ValidateNhsNumber("943 476 591"));
        Assert.Equal(Bad(IdentifierReason.Characters), NationalIdentifiers.ValidateNhsNumber("943 476 591X"));
        Assert.Equal(Bad(IdentifierReason.Characters), NationalIdentifiers.ValidateNhsNumber(""));
    }

    [Fact]
    public void CanadaSocialInsuranceNumber()
    {
        Assert.Equal(Ok, NationalIdentifiers.ValidateCanadaSocialInsuranceNumber("046 454 286"));
        Assert.Equal(Bad(IdentifierReason.Checksum), NationalIdentifiers.ValidateCanadaSocialInsuranceNumber("046 454 287"));
        Assert.Equal(Bad(IdentifierReason.Length), NationalIdentifiers.ValidateCanadaSocialInsuranceNumber("046 454 28"));
        Assert.Equal(Bad(IdentifierReason.Characters), NationalIdentifiers.ValidateCanadaSocialInsuranceNumber("046 454 28A"));
    }

    [Fact]
    public void NederlandBurgerservicenummer()
    {
        Assert.Equal(Ok, NationalIdentifiers.ValidateNederlandBurgerservicenummer("111222333"));
        Assert.Equal(Bad(IdentifierReason.Checksum), NationalIdentifiers.ValidateNederlandBurgerservicenummer("111222334"));
        Assert.Equal(Bad(IdentifierReason.Checksum), NationalIdentifiers.ValidateNederlandBurgerservicenummer("000000000"));
        Assert.Equal(Bad(IdentifierReason.Length), NationalIdentifiers.ValidateNederlandBurgerservicenummer("11122233"));
    }

    [Fact]
    public void BelgiqueRegistreNational()
    {
        Assert.Equal(Ok, NationalIdentifiers.ValidateBelgiqueRegistreNational("85.07.30-033.28"));
        var check = 97 - (2_000_000_000L + 10_101_001L) % 97;
        Assert.Equal(Ok, NationalIdentifiers.ValidateBelgiqueRegistreNational($"010101001{check:D2}"));
        Assert.Equal(Bad(IdentifierReason.Checksum), NationalIdentifiers.ValidateBelgiqueRegistreNational("85.07.30-033.29"));
        Assert.Equal(Bad(IdentifierReason.Date), NationalIdentifiers.ValidateBelgiqueRegistreNational("85.19.30-033.28"));
        Assert.Equal(Bad(IdentifierReason.Date), NationalIdentifiers.ValidateBelgiqueRegistreNational("85.07.32-033.28"));
        Assert.Equal(Bad(IdentifierReason.Structure), NationalIdentifiers.ValidateBelgiqueRegistreNational("85.07.30-000.28"));
        Assert.Equal(Bad(IdentifierReason.Length), NationalIdentifiers.ValidateBelgiqueRegistreNational("85.07.30-033.2"));
    }

    [Fact]
    public void SverigePersonnummer()
    {
        Assert.Equal(Ok, NationalIdentifiers.ValidateSverigePersonnummer("811228-9874"));
        Assert.Equal(Ok, NationalIdentifiers.ValidateSverigePersonnummer("19811228-9874"));
        Assert.Equal(Ok, NationalIdentifiers.ValidateSverigePersonnummer("198112289874"));
        var stem = "811288987";
        var samordning = stem + Enumerable.Range(0, 10).First(c => NationalIdentifiers.LuhnValid(stem + c));
        Assert.Equal(Ok, NationalIdentifiers.ValidateSverigePersonnummer(samordning));
        Assert.Equal(Bad(IdentifierReason.Checksum), NationalIdentifiers.ValidateSverigePersonnummer("811228-9875"));
        Assert.Equal(Bad(IdentifierReason.Date), NationalIdentifiers.ValidateSverigePersonnummer("19810230-9874"));
        Assert.Equal(Bad(IdentifierReason.Length), NationalIdentifiers.ValidateSverigePersonnummer("811228-987"));
        Assert.Equal(Bad(IdentifierReason.Characters), NationalIdentifiers.ValidateSverigePersonnummer("81122x-9874"));
    }

    [Fact]
    public void PolskaPesel()
    {
        Assert.Equal(Ok, NationalIdentifiers.ValidatePolskaPesel("44051401359"));
        Assert.Equal(Bad(IdentifierReason.Checksum), NationalIdentifiers.ValidatePolskaPesel("44051401358"));
        Assert.Equal(Bad(IdentifierReason.Date), NationalIdentifiers.ValidatePolskaPesel("44131401359"));
        Assert.Equal(Bad(IdentifierReason.Length), NationalIdentifiers.ValidatePolskaPesel("4405140135"));
    }

    [Fact]
    public void AustraliaTaxFileNumber()
    {
        Assert.Equal(Ok, NationalIdentifiers.ValidateAustraliaTaxFileNumber("123 456 782"));
        Assert.Equal(Bad(IdentifierReason.Checksum), NationalIdentifiers.ValidateAustraliaTaxFileNumber("123 456 783"));
        Assert.Equal(Bad(IdentifierReason.Length), NationalIdentifiers.ValidateAustraliaTaxFileNumber("123 456 78"));
    }

    private static string WithVerhoeff(string body)
        => body + Enumerable.Range(0, 10).First(c => NationalIdentifiers.VerhoeffValid(body + c));

    [Fact]
    public void BharatAadhaar()
    {
        var good = WithVerhoeff("23456789012");
        Assert.Equal(Ok, NationalIdentifiers.ValidateBharatAadhaar(good));
        var wrong = good[..11] + (good[11] - '0' + 1) % 10;
        Assert.Equal(Bad(IdentifierReason.Checksum), NationalIdentifiers.ValidateBharatAadhaar(wrong));
        Assert.Equal(Bad(IdentifierReason.Structure), NationalIdentifiers.ValidateBharatAadhaar(WithVerhoeff("03456789012")));
        Assert.Equal(Bad(IdentifierReason.Length), NationalIdentifiers.ValidateBharatAadhaar("2345678901"));
    }

    [Fact]
    public void SchweizAhvNummer()
    {
        Assert.Equal(Ok, NationalIdentifiers.ValidateSchweizAhvNummer("756.9217.0769.85"));
        Assert.Equal(Bad(IdentifierReason.Checksum), NationalIdentifiers.ValidateSchweizAhvNummer("756.9217.0769.84"));
        Assert.Equal(Bad(IdentifierReason.Structure), NationalIdentifiers.ValidateSchweizAhvNummer("757.9217.0769.85"));
        Assert.Equal(Bad(IdentifierReason.Length), NationalIdentifiers.ValidateSchweizAhvNummer("756.9217.0769.8"));
    }

    private static string WithNirKey(string body)
    {
        var n = body.Replace("2A", "19").Replace("2B", "18");
        var r = 0;
        foreach (var c in n) r = (r * 10 + (c - '0')) % 97;
        return body + (97 - r).ToString("D2");
    }

    [Fact]
    public void FranceNir()
    {
        Assert.Equal(Ok, NationalIdentifiers.ValidateFranceNir(WithNirKey("1850775123456")));
        var corsica = WithNirKey("185072A123456");
        Assert.Equal(Ok, NationalIdentifiers.ValidateFranceNir(corsica));
        Assert.Equal(Ok, NationalIdentifiers.ValidateFranceNir(corsica.ToLowerInvariant()));
        Assert.Equal(Ok, NationalIdentifiers.ValidateFranceNir(WithNirKey("185072B123456")));
        var good = WithNirKey("1850775123456");
        var wrongKey = ((int.Parse(good[13..]) % 97) + 1).ToString("D2");
        Assert.Equal(Bad(IdentifierReason.Checksum), NationalIdentifiers.ValidateFranceNir(good[..13] + wrongKey));
        Assert.Equal(Bad(IdentifierReason.Characters), NationalIdentifiers.ValidateFranceNir("185072C12345600"));
        Assert.Equal(Bad(IdentifierReason.Length), NationalIdentifiers.ValidateFranceNir("1850775123456"));
    }

    private static string WithTcKimlik(string first9)
    {
        var d = first9.Select(c => c - '0').ToArray();
        var tenth = (((d[0] + d[2] + d[4] + d[6] + d[8]) * 7 - (d[1] + d[3] + d[5] + d[7])) % 10 + 10) % 10;
        var eleventh = (d.Sum() + tenth) % 10;
        return first9 + tenth + eleventh;
    }

    [Fact]
    public void TurkiyeTcKimlikNumarasi()
    {
        var good = WithTcKimlik("123456789");
        Assert.Equal(Ok, NationalIdentifiers.ValidateTurkiyeTcKimlikNumarasi(good));
        Assert.Equal(Bad(IdentifierReason.Checksum), NationalIdentifiers.ValidateTurkiyeTcKimlikNumarasi(good[..9] + (good[9] - '0' + 1) % 10 + good[10]));
        Assert.Equal(Bad(IdentifierReason.Checksum), NationalIdentifiers.ValidateTurkiyeTcKimlikNumarasi(good[..10] + (good[10] - '0' + 1) % 10));
        Assert.Equal(Bad(IdentifierReason.Structure), NationalIdentifiers.ValidateTurkiyeTcKimlikNumarasi(WithTcKimlik("023456789")));
        Assert.Equal(Bad(IdentifierReason.Length), NationalIdentifiers.ValidateTurkiyeTcKimlikNumarasi("1234567890"));
    }

    [Fact]
    public void BulgariaEdinenGrazhdanskiNomer()
    {
        Assert.Equal(Ok, NationalIdentifiers.ValidateBulgariaEdinenGrazhdanskiNomer("8032056031"));
        var weights = new[] { 2, 4, 8, 5, 10, 9, 7, 3, 6 };
        var stem = Enumerable.Range(0, 1000).Select(n => "803205" + n.ToString("D3"))
            .First(t => t.Select((c, k) => (c - '0') * weights[k]).Sum() % 11 == 10);
        Assert.Equal(Ok, NationalIdentifiers.ValidateBulgariaEdinenGrazhdanskiNomer(stem + "0"));
        Assert.Equal(Bad(IdentifierReason.Checksum), NationalIdentifiers.ValidateBulgariaEdinenGrazhdanskiNomer(stem + "1"));
        Assert.Equal(Bad(IdentifierReason.Checksum), NationalIdentifiers.ValidateBulgariaEdinenGrazhdanskiNomer("8032056032"));
        Assert.Equal(Bad(IdentifierReason.Date), NationalIdentifiers.ValidateBulgariaEdinenGrazhdanskiNomer("8013326031"));
        Assert.Equal(Bad(IdentifierReason.Length), NationalIdentifiers.ValidateBulgariaEdinenGrazhdanskiNomer("803205603"));
    }

    private static string WithNorwayChecks(string nine)
    {
        var d = nine.Select(c => c - '0').ToList();
        static int K(int[] w, List<int> digits) { var r = 11 - digits.Select((n, i) => n * w[i]).Sum() % 11; return r == 11 ? 0 : r; }
        var k1 = K([3, 7, 6, 1, 8, 9, 4, 5, 2], d);
        d.Add(k1);
        var k2 = K([5, 4, 3, 2, 7, 6, 5, 4, 3, 2], d);
        return k1 == 10 || k2 == 10 ? "" : nine + k1 + k2;
    }

    private static string NorwayFrom(string ddmmyy, int from)
        => Enumerable.Range(from, 50).Select(n => WithNorwayChecks(ddmmyy + n.ToString("D3"))).First(v => v != "");

    [Fact]
    public void NorgeFodselsnummer()
    {
        Assert.Equal(Ok, NationalIdentifiers.ValidateNorgeFodselsnummer(NorwayFrom("010185", 100)));
        Assert.Equal(Ok, NationalIdentifiers.ValidateNorgeFodselsnummer(NorwayFrom("010100", 500)));
        Assert.Equal(Ok, NationalIdentifiers.ValidateNorgeFodselsnummer(NorwayFrom("010160", 500)));
        Assert.Equal(Ok, NationalIdentifiers.ValidateNorgeFodselsnummer(NorwayFrom("410185", 100)));
        Assert.Equal(Ok, NationalIdentifiers.ValidateNorgeFodselsnummer(NorwayFrom("014185", 100)));
        var good = NorwayFrom("010185", 100);
        Assert.Equal(Bad(IdentifierReason.Checksum), NationalIdentifiers.ValidateNorgeFodselsnummer(good[..10] + (good[10] - '0' + 1) % 10));
        Assert.Equal(Bad(IdentifierReason.Date), NationalIdentifiers.ValidateNorgeFodselsnummer("31028510000"));
        Assert.Equal(Bad(IdentifierReason.Length), NationalIdentifiers.ValidateNorgeFodselsnummer("0101851000"));
    }

    [Fact]
    public void EestiIsikukood()
    {
        Assert.Equal(Ok, NationalIdentifiers.ValidateEestiIsikukood("37605030299"));
        Assert.Equal(Bad(IdentifierReason.Checksum), NationalIdentifiers.ValidateEestiIsikukood("37605030298"));
        Assert.Equal(Bad(IdentifierReason.Structure), NationalIdentifiers.ValidateEestiIsikukood("07605030299"));
        Assert.Equal(Bad(IdentifierReason.Structure), NationalIdentifiers.ValidateEestiIsikukood("97605030299"));
        Assert.Equal(Bad(IdentifierReason.Date), NationalIdentifiers.ValidateEestiIsikukood("37613030299"));
        Assert.Equal(Bad(IdentifierReason.Length), NationalIdentifiers.ValidateEestiIsikukood("3760503029"));
        var body = Enumerable.Range(0, 1000).Select(n => "3760503" + n.ToString("D3"))
            .First(b => b.Select((c, k) => (c - '0') * new[] { 1, 2, 3, 4, 5, 6, 7, 8, 9, 1 }[k]).Sum() % 11 == 10);
        var second = body.Select((c, k) => (c - '0') * new[] { 3, 4, 5, 6, 7, 8, 9, 1, 2, 3 }[k]).Sum() % 11;
        Assert.Equal(Ok, NationalIdentifiers.ValidateEestiIsikukood(body + (second == 10 ? 0 : second)));
    }

    [Fact]
    public void RodneCislo()
    {
        Assert.Equal(Ok, NationalIdentifiers.ValidateRodneCislo("710319/2745"));
        Assert.Equal(Ok, NationalIdentifiers.ValidateRodneCislo("535319/123"));
        var n = Enumerable.Range(700101000, 1000).First(v => v % 11 == 10);
        Assert.Equal(Ok, NationalIdentifiers.ValidateRodneCislo($"{n}0"));
        Assert.Equal(Bad(IdentifierReason.Checksum), NationalIdentifiers.ValidateRodneCislo($"{n}1"));
        Assert.Equal(Bad(IdentifierReason.Checksum), NationalIdentifiers.ValidateRodneCislo("710319/2746"));
        Assert.Equal(Bad(IdentifierReason.Date), NationalIdentifiers.ValidateRodneCislo("711319/2745"));
        Assert.Equal(Bad(IdentifierReason.Structure), NationalIdentifiers.ValidateRodneCislo("710319/123"));
        Assert.Equal(Bad(IdentifierReason.Length), NationalIdentifiers.ValidateRodneCislo("71031927"));
    }

    [Fact]
    public void MagyarorszagTajSzam()
    {
        Assert.Equal(Ok, NationalIdentifiers.ValidateMagyarorszagTajSzam("123 456 788"));
        Assert.Equal(Bad(IdentifierReason.Checksum), NationalIdentifiers.ValidateMagyarorszagTajSzam("123 456 789"));
        Assert.Equal(Bad(IdentifierReason.Length), NationalIdentifiers.ValidateMagyarorszagTajSzam("123 456 78"));
    }

    [Fact]
    public void RossiyaSnils()
    {
        Assert.Equal(Ok, NationalIdentifiers.ValidateRossiyaSnils("112-233-445 95"));
        Assert.Equal(Bad(IdentifierReason.Checksum), NationalIdentifiers.ValidateRossiyaSnils("112-233-445 96"));
        Assert.Equal(Bad(IdentifierReason.Length), NationalIdentifiers.ValidateRossiyaSnils("112-233-445 9"));
        static int Sum(string stem) => stem.Select((c, k) => (c - '0') * (9 - k)).Sum();
        string Stem(Func<int, bool> wanted, string prefix)
            => Enumerable.Range(0, 100000).Select(i => prefix + i.ToString("D" + (9 - prefix.Length))).First(t => wanted(Sum(t)));
        var over = Stem(sum => sum > 101 && sum % 101 != 100 && sum % 101 != 0, "9999");
        Assert.Equal(Ok, NationalIdentifiers.ValidateRossiyaSnils(over + (Sum(over) % 101).ToString("D2")));
        Assert.Equal(Ok, NationalIdentifiers.ValidateRossiyaSnils(Stem(sum => sum == 100, "0000") + "00"));
        Assert.Equal(Ok, NationalIdentifiers.ValidateRossiyaSnils(Stem(sum => sum == 101, "0000") + "00"));
        Assert.Equal(Ok, NationalIdentifiers.ValidateRossiyaSnils(Stem(sum => sum > 101 && sum % 101 == 100, "9999") + "00"));
    }

    [Fact]
    public void SuomiHenkilotunnus()
    {
        const string table = "0123456789ABCDEFHJKLMNPRSTUVWXY";
        Assert.Equal(Ok, NationalIdentifiers.ValidateSuomiHenkilotunnus("131052-308T"));
        Assert.Equal(Ok, NationalIdentifiers.ValidateSuomiHenkilotunnus($"010106A123{table[10106123 % 31]}"));
        Assert.Equal(Ok, NationalIdentifiers.ValidateSuomiHenkilotunnus($"010180+123{table[10180123 % 31]}"));
        Assert.Equal(Bad(IdentifierReason.Checksum), NationalIdentifiers.ValidateSuomiHenkilotunnus("131052-308U"));
        Assert.Equal(Bad(IdentifierReason.Date), NationalIdentifiers.ValidateSuomiHenkilotunnus("311152-308T"));
        Assert.Equal(Bad(IdentifierReason.Structure), NationalIdentifiers.ValidateSuomiHenkilotunnus("131052-001T"));
        Assert.Equal(Bad(IdentifierReason.Length), NationalIdentifiers.ValidateSuomiHenkilotunnus("131052-308"));
        Assert.Equal(Bad(IdentifierReason.Characters), NationalIdentifiers.ValidateSuomiHenkilotunnus("131052x308T"));
        Assert.Equal(Bad(IdentifierReason.Characters), NationalIdentifiers.ValidateSuomiHenkilotunnus("131052-308t"));
    }

    [Fact]
    public void ItaliaCodiceFiscale()
    {
        Assert.Equal(Ok, NationalIdentifiers.ValidateItaliaCodiceFiscale("RSSMRA85T10A562S"));
        Assert.Equal(Bad(IdentifierReason.Checksum), NationalIdentifiers.ValidateItaliaCodiceFiscale("RSSMRA85T10A562T"));
        Assert.Equal(Bad(IdentifierReason.Date), NationalIdentifiers.ValidateItaliaCodiceFiscale("RSSMRA85F10A562S"));
        Assert.Equal(Bad(IdentifierReason.Date), NationalIdentifiers.ValidateItaliaCodiceFiscale("RSSMRA85T32A562S"));
        Assert.Equal(Bad(IdentifierReason.Structure), NationalIdentifiers.ValidateItaliaCodiceFiscale("1SSMRA85T10A562S"));
        Assert.Equal(Bad(IdentifierReason.Length), NationalIdentifiers.ValidateItaliaCodiceFiscale("RSSMRA85T10A562"));
        Assert.Equal(Bad(IdentifierReason.Characters), NationalIdentifiers.ValidateItaliaCodiceFiscale("rssmra85t10a562s"));
    }

    [Fact]
    public void PortugalNumeroDeIdentificacaoFiscal()
    {
        Assert.Equal(Ok, NationalIdentifiers.ValidatePortugalNumeroDeIdentificacaoFiscal("123456789"));
        var weights = new[] { 9, 8, 7, 6, 5, 4, 3, 2 };
        var stem = Enumerable.Range(0, 1000).Select(n => "50000" + n.ToString("D3"))
            .First(t => 11 - t.Select((c, k) => (c - '0') * weights[k]).Sum() % 11 >= 10);
        Assert.Equal(Ok, NationalIdentifiers.ValidatePortugalNumeroDeIdentificacaoFiscal(stem + "0"));
        Assert.Equal(Bad(IdentifierReason.Checksum), NationalIdentifiers.ValidatePortugalNumeroDeIdentificacaoFiscal(stem + "1"));
        Assert.Equal(Bad(IdentifierReason.Length), NationalIdentifiers.ValidatePortugalNumeroDeIdentificacaoFiscal("12345678"));
        Assert.Equal(Bad(IdentifierReason.Characters), NationalIdentifiers.ValidatePortugalNumeroDeIdentificacaoFiscal("12345678x"));
    }

    private static string ChileDv(string body)
    {
        var sum = body.Reverse().Select((c, i) => (c - '0') * (2 + i % 6)).Sum();
        var check = 11 - sum % 11;
        return check == 11 ? "0" : check == 10 ? "K" : check.ToString();
    }

    [Fact]
    public void ChileRolUnicoNacional()
    {
        Assert.Equal(Ok, NationalIdentifiers.ValidateChileRolUnicoNacional("12.345.678-5"));
        var k = Enumerable.Range(0, 1000).Select(n => (10000000 + n).ToString()).First(b => ChileDv(b) == "K");
        var zero = Enumerable.Range(0, 1000).Select(n => (10000000 + n).ToString()).First(b => ChileDv(b) == "0");
        Assert.Equal(Ok, NationalIdentifiers.ValidateChileRolUnicoNacional($"{k}-K"));
        Assert.Equal(Ok, NationalIdentifiers.ValidateChileRolUnicoNacional($"{zero}-0"));
        Assert.Equal(Bad(IdentifierReason.Checksum), NationalIdentifiers.ValidateChileRolUnicoNacional($"{k}-0"));
        Assert.Equal(Bad(IdentifierReason.Checksum), NationalIdentifiers.ValidateChileRolUnicoNacional("12.345.678-4"));
        Assert.Equal(Bad(IdentifierReason.Length), NationalIdentifiers.ValidateChileRolUnicoNacional("5"));
        Assert.Equal(Bad(IdentifierReason.Characters), NationalIdentifiers.ValidateChileRolUnicoNacional("12.345.678-k"));
    }

    [Fact]
    public void UruguayCedulaDeIdentidad()
    {
        Assert.Equal(Ok, NationalIdentifiers.ValidateUruguayCedulaDeIdentidad("1.234.567-2"));
        var weights = new[] { 2, 9, 8, 7, 6, 3, 4 };
        const string body = "0123456";
        var check = (10 - body.Select((c, k) => (c - '0') * weights[k]).Sum() % 10) % 10;
        Assert.Equal(Ok, NationalIdentifiers.ValidateUruguayCedulaDeIdentidad($"{body[1..]}-{check}"));
        Assert.Equal(Bad(IdentifierReason.Checksum), NationalIdentifiers.ValidateUruguayCedulaDeIdentidad("1.234.567-3"));
        Assert.Equal(Bad(IdentifierReason.Length), NationalIdentifiers.ValidateUruguayCedulaDeIdentidad("1.234.56"));
    }

    [Fact]
    public void EcuadorCedulaDeIdentidad()
    {
        Assert.Equal(Ok, NationalIdentifiers.ValidateEcuadorCedulaDeIdentidad("1710034065"));
        Assert.Equal(Bad(IdentifierReason.Checksum), NationalIdentifiers.ValidateEcuadorCedulaDeIdentidad("1710034066"));
        Assert.Equal(Bad(IdentifierReason.Structure), NationalIdentifiers.ValidateEcuadorCedulaDeIdentidad("9910034065"));
        Assert.Equal(Bad(IdentifierReason.Structure), NationalIdentifiers.ValidateEcuadorCedulaDeIdentidad("1760034065"));
        Assert.Equal(Bad(IdentifierReason.Length), NationalIdentifiers.ValidateEcuadorCedulaDeIdentidad("171003406"));
    }

    [Fact]
    public void ArgentinaCodigoUnicoDeIdentificacionLaboral()
    {
        static int Remainder(string body) => body.Select((c, i) => (c - '0') * new[] { 5, 4, 3, 2, 7, 6, 5, 4, 3, 2 }[i]).Sum() % 11;
        Assert.Equal(Ok, NationalIdentifiers.ValidateArgentinaCodigoUnicoDeIdentificacionLaboral("20-12345678-6"));
        var zero = Enumerable.Range(0, 1000).Select(n => "2000000" + n.ToString("D3")).First(b => Remainder(b) == 0);
        Assert.Equal(Ok, NationalIdentifiers.ValidateArgentinaCodigoUnicoDeIdentificacionLaboral(zero + "0"));
        var ten = Enumerable.Range(0, 1000).Select(n => "2000000" + n.ToString("D3")).First(b => Remainder(b) == 1);
        Assert.Equal(Bad(IdentifierReason.Checksum), NationalIdentifiers.ValidateArgentinaCodigoUnicoDeIdentificacionLaboral(ten + "0"));
        Assert.Equal(Bad(IdentifierReason.Checksum), NationalIdentifiers.ValidateArgentinaCodigoUnicoDeIdentificacionLaboral(ten + "9"));
        Assert.Equal(Bad(IdentifierReason.Structure), NationalIdentifiers.ValidateArgentinaCodigoUnicoDeIdentificacionLaboral("21-12345678-6"));
        Assert.Equal(Bad(IdentifierReason.Length), NationalIdentifiers.ValidateArgentinaCodigoUnicoDeIdentificacionLaboral("20-12345678"));
    }

    [Fact]
    public void MexicoClaveUnicaDeRegistroDePoblacion()
    {
        Assert.Equal(Ok, NationalIdentifiers.ValidateMexicoClaveUnicaDeRegistroDePoblacion("HEGG560427MVZRRL04"));
        Assert.Equal(Bad(IdentifierReason.Checksum), NationalIdentifiers.ValidateMexicoClaveUnicaDeRegistroDePoblacion("HEGG560427MVZRRL05"));
        Assert.Equal(Bad(IdentifierReason.Date), NationalIdentifiers.ValidateMexicoClaveUnicaDeRegistroDePoblacion("HEGG561327MVZRRL04"));
        Assert.Equal(Bad(IdentifierReason.Structure), NationalIdentifiers.ValidateMexicoClaveUnicaDeRegistroDePoblacion("HEGG560427QVZRRL04"));
        Assert.Equal(Bad(IdentifierReason.Length), NationalIdentifiers.ValidateMexicoClaveUnicaDeRegistroDePoblacion("HEGG560427MVZRRL0"));
        Assert.Equal(Bad(IdentifierReason.Characters), NationalIdentifiers.ValidateMexicoClaveUnicaDeRegistroDePoblacion("hegg560427mvzrrl04"));
    }

    [Fact]
    public void SouthAfricaIdentityNumber()
    {
        Assert.Equal(Ok, NationalIdentifiers.ValidateSouthAfricaIdentityNumber("8001015009087"));
        Assert.Equal(Bad(IdentifierReason.Checksum), NationalIdentifiers.ValidateSouthAfricaIdentityNumber("8001015009086"));
        Assert.Equal(Bad(IdentifierReason.Date), NationalIdentifiers.ValidateSouthAfricaIdentityNumber("8013015009087"));
        const string stem = "800101500920";
        var withCheck = stem + Enumerable.Range(0, 10).First(c => NationalIdentifiers.LuhnValid(stem + c));
        Assert.Equal(Bad(IdentifierReason.Structure), NationalIdentifiers.ValidateSouthAfricaIdentityNumber(withCheck));
        Assert.Equal(Bad(IdentifierReason.Length), NationalIdentifiers.ValidateSouthAfricaIdentityNumber("800101500908"));
    }

    [Fact]
    public void SingaporeNationalRegistrationIdentityCard()
    {
        foreach (var number in new[] { "S1234567D", "T1234567J", "F1234567N", "G1234567X" })
            Assert.Equal(Ok, NationalIdentifiers.ValidateSingaporeNationalRegistrationIdentityCard(number));
        Assert.Equal(Bad(IdentifierReason.Checksum), NationalIdentifiers.ValidateSingaporeNationalRegistrationIdentityCard("S1234567E"));
        Assert.Equal(Bad(IdentifierReason.Structure), NationalIdentifiers.ValidateSingaporeNationalRegistrationIdentityCard("A1234567D"));
        Assert.Equal(Bad(IdentifierReason.Length), NationalIdentifiers.ValidateSingaporeNationalRegistrationIdentityCard("S123456D"));
        Assert.Equal(Bad(IdentifierReason.Characters), NationalIdentifiers.ValidateSingaporeNationalRegistrationIdentityCard("S123456?D"));
    }

    [Fact]
    public void TaiwanGuominShenfenzhengTongyiBianhao()
    {
        Assert.Equal(Ok, NationalIdentifiers.ValidateTaiwanGuominShenfenzhengTongyiBianhao("A123456789"));
        Assert.Equal(Bad(IdentifierReason.Checksum), NationalIdentifiers.ValidateTaiwanGuominShenfenzhengTongyiBianhao("A123456788"));
        Assert.Equal(Bad(IdentifierReason.Structure), NationalIdentifiers.ValidateTaiwanGuominShenfenzhengTongyiBianhao("A323456789"));
        Assert.Equal(Bad(IdentifierReason.Length), NationalIdentifiers.ValidateTaiwanGuominShenfenzhengTongyiBianhao("A12345678"));
    }

    [Fact]
    public void NihonKojinBango()
    {
        Assert.Equal(Ok, NationalIdentifiers.ValidateNihonKojinBango("123456789018"));
        Assert.Equal(Ok, NationalIdentifiers.ValidateNihonKojinBango("1234 5678 9018"));
        Assert.Equal(Bad(IdentifierReason.Checksum), NationalIdentifiers.ValidateNihonKojinBango("123456789019"));
        Assert.Equal(Bad(IdentifierReason.Length), NationalIdentifiers.ValidateNihonKojinBango("12345678901"));
    }

    [Fact]
    public void ZhongguoJuminShenfenzhengHaoma()
    {
        Assert.Equal(Ok, NationalIdentifiers.ValidateZhongguoJuminShenfenzhengHaoma("11010519491231002X"));
        Assert.Equal(Bad(IdentifierReason.Checksum), NationalIdentifiers.ValidateZhongguoJuminShenfenzhengHaoma("110105194912310021"));
        Assert.Equal(Bad(IdentifierReason.Date), NationalIdentifiers.ValidateZhongguoJuminShenfenzhengHaoma("11010519491331002X"));
        Assert.Equal(Bad(IdentifierReason.Length), NationalIdentifiers.ValidateZhongguoJuminShenfenzhengHaoma("11010519491231002"));
        Assert.Equal(Bad(IdentifierReason.Characters), NationalIdentifiers.ValidateZhongguoJuminShenfenzhengHaoma("11010519491231002x"));
    }

    [Fact]
    public void LatvijaPersonasKods()
    {
        Assert.Equal(Ok, NationalIdentifiers.ValidateLatvijaPersonasKods("161175-19997"));
        Assert.Equal(Ok, NationalIdentifiers.ValidateLatvijaPersonasKods("32123456789"));
        Assert.Equal(Bad(IdentifierReason.Checksum), NationalIdentifiers.ValidateLatvijaPersonasKods("161175-19998"));
        Assert.Equal(Bad(IdentifierReason.Date), NationalIdentifiers.ValidateLatvijaPersonasKods("311175-19997"));
        Assert.Equal(Bad(IdentifierReason.Structure), NationalIdentifiers.ValidateLatvijaPersonasKods("161175-39997"));
        Assert.Equal(Bad(IdentifierReason.Length), NationalIdentifiers.ValidateLatvijaPersonasKods("161175-1999"));
    }

    private static string WithLithuaniaCheck(string body)
    {
        var d = body.Select(c => c - '0').ToArray();
        var c1 = d.Select((n, i) => n * new[] { 1, 2, 3, 4, 5, 6, 7, 8, 9, 1 }[i]).Sum() % 11;
        if (c1 == 10)
        {
            c1 = d.Select((n, i) => n * new[] { 3, 4, 5, 6, 7, 8, 9, 1, 2, 3 }[i]).Sum() % 11;
            if (c1 == 10) c1 = 0;
        }
        return body + c1;
    }

    [Fact]
    public void LietuvaAsmensKodas()
    {
        Assert.Equal(Ok, NationalIdentifiers.ValidateLietuvaAsmensKodas(WithLithuaniaCheck("3900101000")));
        Assert.Equal(Ok, NationalIdentifiers.ValidateLietuvaAsmensKodas(WithLithuaniaCheck("5050505000")));
        Assert.Equal(Ok, NationalIdentifiers.ValidateLietuvaAsmensKodas(WithLithuaniaCheck("1900101000")));
        var good = WithLithuaniaCheck("3900101000");
        Assert.Equal(Bad(IdentifierReason.Checksum), NationalIdentifiers.ValidateLietuvaAsmensKodas(good[..10] + (good[10] - '0' + 1) % 10));
        Assert.Equal(Bad(IdentifierReason.Structure), NationalIdentifiers.ValidateLietuvaAsmensKodas(WithLithuaniaCheck("7900101000")));
        Assert.Equal(Bad(IdentifierReason.Date), NationalIdentifiers.ValidateLietuvaAsmensKodas(WithLithuaniaCheck("3901301000")));
        Assert.Equal(Bad(IdentifierReason.Length), NationalIdentifiers.ValidateLietuvaAsmensKodas("3900101000"));
    }
}
