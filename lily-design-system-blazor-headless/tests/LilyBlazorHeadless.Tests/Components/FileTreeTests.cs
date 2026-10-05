using Bunit;
using LilyBlazorHeadless.Components;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

// Keyboard behaviour lives in FileTree.razor.js (see tests/js/file-tree.test.mjs).
// These tests cover the Razor contract and the JS interop wiring.
public class FileTreeTests : TestContext
{
    private (IRenderedComponent<FileTree> cut, BunitJSModuleInterop module) Render(Action<ComponentParameterCollectionBuilder<FileTree>>? extra = null)
    {
        var module = JSInterop.SetupModule(FileTree.ModulePath);
        module.Mode = JSRuntimeMode.Loose;
        var cut = RenderComponent<FileTree>(p =>
        {
            p.Add(x => x.Label, "Files").AddChildContent("<li role=\"treeitem\">a</li>");
            extra?.Invoke(p);
        });
        return (cut, module);
    }

    [Fact]
    public void Root_is_ul_role_tree_with_class_and_aria_label()
    {
        var root = Render().cut.Find("ul");
        Assert.Equal("tree", root.GetAttribute("role"));
        Assert.StartsWith("file-tree", root.GetAttribute("class"));
        Assert.Equal("Files", root.GetAttribute("aria-label"));
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
        => Assert.Equal("file-tree extra", Render(p => p.Add(x => x.CssClass, "extra")).cut.Find("ul").GetAttribute("class"));

    [Fact]
    public void Renders_consumer_tree_items()
        => Assert.Single(Render().cut.FindAll("[role=treeitem]"));

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
        => Assert.Equal("value", Render(p => p.AddUnmatched("data-test", "value")).cut.Find("ul").GetAttribute("data-test"));

    [Fact]
    public void Attaches_the_keyboard_module_to_the_root_after_first_render()
    {
        var (_, module) = Render();
        var call = Assert.Single(module.Invocations, i => i.Identifier == "attach");
        Assert.Single(call.Arguments);
    }

    [Fact]
    public void Imports_the_library_static_asset_module()
    {
        Render();
        Assert.Contains(JSInterop.Invocations, i => i.Identifier == "import" && (string?)i.Arguments[0] == FileTree.ModulePath);
        Assert.EndsWith("/Components/FileTree.razor.js", FileTree.ModulePath);
    }
}
