using Bunit;
using LilyBlazorHeadless.Components;
using Microsoft.AspNetCore.Components.Forms;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class FileUploadTests : TestContext
{
    public FileUploadTests() => JSInterop.Mode = JSRuntimeMode.Loose;

    private IRenderedComponent<FileUpload> Make(Action<ComponentParameterCollectionBuilder<FileUpload>>? more = null) =>
        RenderComponent<FileUpload>(p =>
        {
            p.Add(x => x.Label, "Choose");
            more?.Invoke(p);
        });

    [Fact]
    public void Renders_with_kebab_base_class() => Assert.NotNull(Make().Find("div.file-upload"));

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class() =>
        Assert.Contains("extra", Make(p => p.Add(x => x.CssClass, "extra")).Find("div.file-upload").GetAttribute("class"));

    [Fact]
    public void AdditionalAttributes_pass_through_to_root() =>
        Assert.Equal("value", Make(p => p.AddUnmatched("data-test", "value")).Find("div.file-upload").GetAttribute("data-test"));

    [Fact]
    public void The_module_joins_the_button_to_a_hidden_input()
    {
        var cut = Make(p => p.Add(x => x.Accept, ".pdf").Add(x => x.Multiple, true));
        var input = cut.Find("input[type=file]");
        Assert.True(input.HasAttribute("hidden"));
        Assert.Equal(".pdf", input.GetAttribute("accept"));
        Assert.True(input.HasAttribute("multiple"));
        Assert.Equal("button", cut.Find("button").GetAttribute("type"));
        Assert.Contains(JSInterop.Invocations, i => i.Identifier == "import" && (string?)i.Arguments[0] == FileUpload.ModulePath);
    }

    [Fact]
    public void Disabled_reaches_the_button() =>
        Assert.True(Make(p => p.Add(x => x.Disabled, true)).Find("button").HasAttribute("disabled"));

    [Fact]
    public void A_choice_reports_and_the_status_is_the_consumers_words()
    {
        var seen = 0;
        var cut = Make(p => p.Add(x => x.SelectedLabel, count => $"{count} chosen").Add(x => x.OnChange, (InputFileChangeEventArgs e) => seen = e.FileCount));
        Assert.Equal("0", cut.Find("span").GetAttribute("data-file-count"));
        cut.FindComponent<InputFile>().UploadFiles(InputFileContent.CreateFromText("a", "a.txt"), InputFileContent.CreateFromText("b", "b.txt"));
        Assert.Equal(2, seen);
        Assert.Equal("2", cut.Find("span").GetAttribute("data-file-count"));
        Assert.Equal("2 chosen", cut.Find("span").TextContent);
    }

    [Fact]
    public void With_no_label_for_the_count_the_status_has_no_English()
    {
        var cut = Make();
        cut.FindComponent<InputFile>().UploadFiles(InputFileContent.CreateFromText("a", "a.txt"));
        Assert.Equal("", cut.Find("span").TextContent);
    }
}
