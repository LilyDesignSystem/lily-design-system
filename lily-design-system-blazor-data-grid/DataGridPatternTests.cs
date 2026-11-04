using System.Collections.Generic;
using System.Linq;
using Bunit;
using LilyDesignSystem.Blazor.Helpers;
using LilyDesignSystem.Blazor.Testing;
using Xunit;

namespace LilyDesignSystem.Blazor.Helpers.Tests;

public class DataGridPatternTests : TestContext
{
    [Fact]
    public void Meets_the_grid_contract()
    {
        JSInterop.Mode = JSRuntimeMode.Loose;
        var ids = new[] { "a", "b", "c" };
        var cut = RenderComponent<DataGrid>(p => p
            .Add(x => x.Label, "People")
            .Add(x => x.Columns, ids.Select(id => new DataGridColumn { Id = id, Header = id }).ToArray())
            .Add(x => x.Rows, Enumerable.Range(1, 3)
                .Select(n => new DataGridRow(ids.Select(id => new KeyValuePair<string, object?>(id, $"{id}{n}"))))
                .ToArray()));
        PatternTester.Run(cut, "grid", "data-grid");
    }
}
