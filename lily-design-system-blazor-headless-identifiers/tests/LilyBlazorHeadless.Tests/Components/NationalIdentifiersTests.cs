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
}
