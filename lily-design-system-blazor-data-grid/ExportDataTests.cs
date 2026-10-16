// ExportData tests — the C# port of the canonical Svelte export-data.test.ts (§8.57–§8.66, §8.78, §8.115).

using System.Collections.Generic;
using System.Linq;
using System.Text;
using LilyDesignSystem.Blazor.Helpers;
using Xunit;

namespace LilyDesignSystem.Blazor.Helpers.Tests;

public class ExportDataTests
{
    private static ExportTable Table(string[] headers, params object?[][] rows)
        => new(headers, rows.Select(r => (IReadOnlyList<object?>)r).ToList());

    /// <summary>Reads a stored-only ZIP back into name → text, checking every CRC.</summary>
    private static Dictionary<string, string> Unzip(byte[] bytes)
    {
        var result = new Dictionary<string, string>();
        var end = bytes.Length - 22;
        Assert.Equal(0x06054B50u, System.BitConverter.ToUInt32(bytes, end));
        var count = System.BitConverter.ToUInt16(bytes, end + 10);
        var entry = (int)System.BitConverter.ToUInt32(bytes, end + 16);
        for (var i = 0; i < count; i++)
        {
            Assert.Equal(0x02014B50u, System.BitConverter.ToUInt32(bytes, entry));
            var crc = System.BitConverter.ToUInt32(bytes, entry + 16);
            var size = (int)System.BitConverter.ToUInt32(bytes, entry + 24);
            var nameLength = System.BitConverter.ToUInt16(bytes, entry + 28);
            var localAt = (int)System.BitConverter.ToUInt32(bytes, entry + 42);
            var name = Encoding.UTF8.GetString(bytes, entry + 46, nameLength);
            var dataAt = localAt + 30 + System.BitConverter.ToUInt16(bytes, localAt + 26) + System.BitConverter.ToUInt16(bytes, localAt + 28);
            var data = bytes.AsSpan(dataAt, size);
            Assert.Equal(crc, ExportData.Crc32(data));
            result[name] = Encoding.UTF8.GetString(data);
            entry += 46 + nameLength;
        }
        return result;
    }

    [Fact]
    public void Section_8_57_Csv_Has_Crlf_Lines_A_Header_And_Quotes_Commas_Quotes_And_Line_Breaks()
    {
        var table = Table(new[] { "a", "b" }, new object?[] { "x,y", "say \"hi\"" }, new object?[] { "two\nlines", 1 });
        Assert.Equal("a,b\r\n\"x,y\",\"say \"\"hi\"\"\"\r\n\"two\nlines\",1\r\n", ExportData.ToCsv(table));
    }

    [Fact]
    public void Section_8_58_Tsv_Uses_Tabs_And_Does_Not_Quote_Commas()
    {
        Assert.Equal("a\tb\r\nx,y\t2\r\n", ExportData.ToTsv(Table(new[] { "a", "b" }, new object?[] { "x,y", 2 })));
    }

    [Fact]
    public void Section_8_59_Formula_Safe_By_Default_For_Strings_Only_Numbers_Untouched_Header_And_Bom_Options()
    {
        var table = Table(new[] { "=h" }, new object?[] { "=SUM(A1)" }, new object?[] { -5 }, new object?[] { "+1" });
        Assert.Equal("'=h\r\n'=SUM(A1)\r\n-5\r\n'+1\r\n", ExportData.ToCsv(table));
        Assert.Equal("=h\r\n=SUM(A1)\r\n-5\r\n+1\r\n", ExportData.ToCsv(table, new DelimitedOptions { Safe = false }));
        Assert.Equal("﻿=SUM(A1)\r\n-5\r\n+1\r\n", ExportData.ToCsv(table, new DelimitedOptions { Safe = false, Header = false, Bom = true }));
    }

    [Fact]
    public void Section_8_60_Booleans_Dates_And_Empty_Cells()
    {
        var table = Table(new[] { "a", "b", "c", "d", "e" }, new object?[] { true, false, null, new System.DateTime(2026, 10, 16, 0, 0, 0, System.DateTimeKind.Utc), new System.DateTime(2026, 10, 16, 9, 30, 0, System.DateTimeKind.Utc) });
        Assert.Equal("a,b,c,d,e\r\nTRUE,FALSE,,2026-10-16,2026-10-16T09:30:00.000Z\r\n", ExportData.ToCsv(table));
    }

    [Fact]
    public void Section_8_61_ColumnName_Counts_A_To_Z_Then_AA()
    {
        Assert.Equal(new[] { "A", "B", "Z", "AA", "AB", "AZ", "BA" }, new[] { 0, 1, 25, 26, 27, 51, 52 }.Select(ExportData.ColumnName).ToArray());
    }

    [Fact]
    public void Section_8_62_A_Valid_Zip_Of_The_Parts_A_Workbook_Needs_Every_Crc_Right()
    {
        var parts = Unzip(ExportData.ToXlsx(Table(new[] { "a" }, new object?[] { 1 })));
        Assert.Equal(new[] { "[Content_Types].xml", "_rels/.rels", "xl/_rels/workbook.xml.rels", "xl/styles.xml", "xl/workbook.xml", "xl/worksheets/sheet1.xml" }, parts.Keys.OrderBy(k => k, System.StringComparer.Ordinal).ToArray());
    }

    [Fact]
    public void Section_8_63_Cells_Keep_Their_Types_The_Header_Is_Bold_And_Frozen()
    {
        var sheet = Unzip(ExportData.ToXlsx(Table(new[] { "Name", "N", "Flag", "Day" }, new object?[] { "Ann", 3.5, true, new System.DateTime(2026, 10, 16, 0, 0, 0, System.DateTimeKind.Utc) })))["xl/worksheets/sheet1.xml"];
        Assert.Contains("<c r=\"A1\" s=\"3\" t=\"inlineStr\"><is><t xml:space=\"preserve\">Name</t></is></c>", sheet);
        Assert.Contains("<c r=\"B2\"><v>3.5</v></c>", sheet);
        Assert.Contains("<c r=\"C2\" t=\"b\"><v>1</v></c>", sheet);
        Assert.Contains("<c r=\"D2\" s=\"1\">", sheet);
        Assert.Contains("state=\"frozen\"", sheet);
    }

    [Fact]
    public void Section_8_64_A_Formula_Looking_String_Stays_Text_Empty_Cells_Are_Omitted_Illegal_Characters_Dropped()
    {
        var sheet = Unzip(ExportData.ToXlsx(Table(new[] { "a", "b", "c" }, new object?[] { "=SUM(A1)", null, "x\u0001y" })))["xl/worksheets/sheet1.xml"];
        Assert.Contains("t=\"inlineStr\"><is><t xml:space=\"preserve\">=SUM(A1)</t>", sheet);
        Assert.DoesNotContain("r=\"B2\"", sheet);
        Assert.Contains(">xy<", sheet);
    }

    [Fact]
    public void Section_8_65_The_Sheet_Name_Is_Cleaned_And_Cut_To_31_Characters_The_Output_Is_Reproducible()
    {
        var table = Table(new[] { "a" }, new object?[] { 1 });
        var workbook = Unzip(ExportData.ToXlsx(table, "A/B:C*[D]?" + new string('x', 40)))["xl/workbook.xml"];
        Assert.Matches("name=\"A B C D x{23}\"", workbook);
        Assert.Equal(ExportData.ToXlsx(table), ExportData.ToXlsx(table));
    }

    [Fact]
    public void Section_8_66_Csv_And_Tsv_Files_Carry_A_Bom_ExportFilename_Adds_The_Extension_Once_And_Cleans_The_Name()
    {
        var table = Table(new[] { "a" }, new object?[] { "é" });
        Assert.Equal("﻿a\r\né\r\n", Encoding.UTF8.GetString(ExportData.ExportBytes(table, DataGridExportFormat.Csv)));
        Assert.Equal("report.csv", ExportData.ExportFilename("report", DataGridExportFormat.Csv));
        Assert.Equal("report.csv", ExportData.ExportFilename("report.csv", DataGridExportFormat.Csv));
        Assert.Equal("a-b-c.xlsx", ExportData.ExportFilename("a/b:c", DataGridExportFormat.Xlsx));
        Assert.Equal("export.tsv", ExportData.ExportFilename("  ", DataGridExportFormat.Tsv));
    }

    [Fact]
    public void Section_8_78_Japanese_Accented_And_Emoji_Text_Survives_Csv_Tsv_And_Xlsx_Unchanged()
    {
        var table = Table(new[] { "名前", "Café" }, new object?[] { "にほんご 日本語", "naïve 🌸" });
        Assert.Equal("﻿名前,Café\r\nにほんご 日本語,naïve 🌸\r\n", Encoding.UTF8.GetString(ExportData.ExportBytes(table, DataGridExportFormat.Csv)));
        Assert.Equal("﻿名前\tCafé\r\nにほんご 日本語\tnaïve 🌸\r\n", Encoding.UTF8.GetString(ExportData.ExportBytes(table, DataGridExportFormat.Tsv)));
        var sheet = Unzip(ExportData.ToXlsx(table))["xl/worksheets/sheet1.xml"];
        Assert.Contains(">名前<", sheet);
        Assert.Contains(">にほんご 日本語<", sheet);
        Assert.Contains(">naïve 🌸<", sheet);
    }

    [Fact]
    public void Section_8_115_A_Formula_Cell_Keeps_Its_Expression_With_The_Result_Cached_In_Xlsx_Csv_Carries_Only_The_Result()
    {
        var table = Table(new[] { "Sum", "Text", "Flag", "Empty", "Date" }, new object?[]
        {
            new ExportFormula("=1+2", 3d), new ExportFormula("=\"a\"&\"<b>\"", "a<b>"), new ExportFormula("=TRUE", true), new ExportFormula("=A9", null),
            new ExportFormula("=DATE(2026,10,16)", new System.DateTime(2026, 10, 16, 0, 0, 0, System.DateTimeKind.Utc)),
        });
        var sheet = Unzip(ExportData.ToXlsx(table))["xl/worksheets/sheet1.xml"];
        Assert.Contains("<c r=\"A2\"><f>1+2</f><v>3</v></c>", sheet);
        Assert.Contains("<c r=\"B2\" t=\"str\"><f>\"a\"&amp;\"&lt;b&gt;\"</f><v>a&lt;b&gt;</v></c>", sheet);
        Assert.Contains("<c r=\"C2\" t=\"b\"><f>TRUE</f><v>1</v></c>", sheet);
        Assert.Contains("<c r=\"D2\"><f>A9</f></c>", sheet);
        Assert.Matches("<c r=\"E2\" s=\"1\"><f>DATE\\(2026,10,16\\)</f><v>\\d+</v></c>", sheet);
        Assert.Equal("Sum,Text,Flag,Empty,Date\r\n3,a<b>,TRUE,,2026-10-16\r\n", ExportData.ToCsv(table));
    }
}
