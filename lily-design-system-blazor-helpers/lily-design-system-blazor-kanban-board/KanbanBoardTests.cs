// KanbanBoard tests — one or more [Fact]s per spec/index.md §8 acceptance
// clause, mirroring the canonical Svelte suite's own §8 numbering
// (KanbanBoard.test.ts). Selectors are read from the actual rendered
// markup (KanbanBoard.razor / the headless KanbanTable family), not
// guessed — see AGENTS.md's "Rigor required" note on the two real bugs
// the Svelte build caught this way (a silently-zero-matching CSS
// selector, and a keyboard event fired on the wrong DOM target).

using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Bunit;
using Bunit.JSInterop;
using LilyDesignSystem.Blazor.Helpers;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Xunit;

namespace LilyDesignSystem.Blazor.Helpers.Tests;

public class KanbanBoardTests : TestContext
{
    private static readonly IReadOnlyList<KanbanColumn> Columns = new[]
    {
        new KanbanColumn { Id = "todo", Title = "To Do" },
        new KanbanColumn { Id = "doing", Title = "In Progress", WipLimit = 1 },
        new KanbanColumn { Id = "done", Title = "Done" },
    };

    private static readonly IReadOnlyList<KanbanCard> Cards = new[]
    {
        new KanbanCard { Id = "c1", ColumnId = "todo", Title = "Card One" },
        new KanbanCard { Id = "c2", ColumnId = "todo", Title = "Card Two" },
        new KanbanCard { Id = "c3", ColumnId = "doing", Title = "Card Three" },
        new KanbanCard { Id = "c4", ColumnId = "doing", Title = "Card Four" },
    };

    private static readonly KanbanLabels Labels = new()
    {
        CardCount = count => $"{count} cards",
        OverLimit = (count, limit) => $"Over limit: {count}/{limit}",
        MoveButton = card => $"Move {card.Title}",
        MoveMenuLabel = "Move to column",
        MoveAnnouncement = (title, column) => $"{title} moved to {column}",
    };

    public KanbanBoardTests()
    {
        // bUnit JSInterop defaults to Strict; relax so the eval-based
        // cell-focus call does not throw during render. See
        // ThemePickerTests for the same setup.
        JSInterop.Mode = JSRuntimeMode.Loose;
        JSInterop.SetupVoid("eval", _ => true).SetVoidResult();
    }

    private IRenderedComponent<KanbanBoard> RenderDefault(KanbanLabels? labels = null, EventCallback<(string, string)>? onMove = null)
        => RenderComponent<KanbanBoard>(p =>
        {
            p.Add(x => x.Label, "Sprint board");
            p.Add(x => x.Columns, Columns);
            p.Add(x => x.Cards, Cards);
            if (labels is not null) p.Add(x => x.Labels, labels);
            if (onMove is not null) p.Add(x => x.OnMove, onMove.Value);
        });

    private static IEnumerable<AngleSharp.Dom.IElement> BodyRows(IRenderedComponent<KanbanBoard> cut)
        => cut.FindAll(".kanban-table-body .kanban-table-row");

    private static IEnumerable<AngleSharp.Dom.IElement> TabbableCells(IRenderedComponent<KanbanBoard> cut)
        => cut.FindAll(".kanban-table-td[tabindex='0']");

    // =====================================================================
    // §8.1-§8.4 — markup
    // =====================================================================

    [Fact]
    public void Section_8_1_Renders_Root_Wrapping_Role_Grid_Labelled_By_Label()
    {
        var cut = RenderDefault();

        Assert.NotNull(cut.Find("div.kanban-board"));
        var grid = cut.Find("[role='grid']");
        Assert.Equal("Sprint board", grid.GetAttribute("aria-label"));
        Assert.Equal("table", grid.TagName.ToLowerInvariant());
    }

    [Fact]
    public void Section_8_1_Body_And_Cells_Carry_Rowgroup_And_Gridcell_Roles()
    {
        // A real bug found while composing this catalog's headless
        // KanbanTable family: KanbanTableBody hardcodes role="list" and
        // KanbanTableTD hardcodes role="listitem" — both wrong for a
        // WAI-ARIA Grid. Verified here that the attribute-splat override
        // (role appears before @attributes in each headless component's
        // own markup, so a caller-supplied role wins) actually took
        // effect at render time, not just compiled.
        var cut = RenderDefault();

        var body = cut.Find(".kanban-table-body");
        Assert.Equal("rowgroup", body.GetAttribute("role"));

        var cell = cut.Find(".kanban-table-td");
        Assert.Equal("gridcell", cell.GetAttribute("role"));
    }

    [Fact]
    public void Section_8_2_Renders_Column_Titles_And_Card_Count_When_Labels_Supplied()
    {
        var cut = RenderDefault(labels: Labels);

        Assert.Contains("To Do", cut.Find("div.kanban-board").TextContent);
        var headers = cut.FindAll(".kanban-table-th");
        Assert.Contains("2 cards", headers[0].TextContent);
        Assert.Contains("0 cards", headers[2].TextContent);
    }

    [Fact]
    public void Section_8_2_No_Card_Count_Renders_When_Labels_CardCount_Absent()
    {
        var cut = RenderDefault();
        Assert.Empty(cut.FindAll(".kanban-board-count"));
    }

    [Fact]
    public void Section_8_3_Column_Over_WipLimit_Carries_DataOverLimit_And_Warning_Text()
    {
        var cut = RenderDefault(labels: Labels);
        var headers = cut.FindAll(".kanban-table-th");

        Assert.True(headers[1].HasAttribute("data-over-limit"));
        Assert.Contains("Over limit: 2/1", headers[1].TextContent);
        Assert.False(headers[0].HasAttribute("data-over-limit"));
        Assert.False(headers[2].HasAttribute("data-over-limit"));
    }

    [Fact]
    public void Section_8_4_Body_Is_Rectangular_Shorter_Columns_Pad_With_Empty_Cells()
    {
        var cut = RenderDefault();
        var rows = BodyRows(cut).ToList();
        Assert.Equal(2, rows.Count); // todo and doing both have 2 cards

        foreach (var row in rows)
        {
            var doneCell = row.QuerySelectorAll(".kanban-table-td")[2];
            Assert.Equal("", doneCell.TextContent.Trim());
        }
    }

    // =====================================================================
    // §8.5-§8.6 — roving-tabindex keyboard navigation
    // =====================================================================

    [Fact]
    public void Section_8_5_Exactly_One_Cell_Tabindex_Zero_Arrows_Move_And_Clamp()
    {
        var cut = RenderDefault();
        var cells = TabbableCells(cut).ToList();
        Assert.Single(cells);
        Assert.Equal("0", cells[0].GetAttribute("data-row"));
        Assert.Equal("0", cells[0].GetAttribute("data-col"));

        cells[0].KeyDown(new KeyboardEventArgs { Key = "ArrowRight" });
        Assert.Equal("1", TabbableCells(cut).Single().GetAttribute("data-col"));

        // Clamp: ArrowUp past the first row stays on the first row.
        TabbableCells(cut).Single().KeyDown(new KeyboardEventArgs { Key = "ArrowUp" });
        var afterClamp = TabbableCells(cut).ToList();
        Assert.Single(afterClamp);
        Assert.Equal("0", afterClamp[0].GetAttribute("data-row"));
    }

    [Fact]
    public void Section_8_6_Home_End_Move_Within_Column_CtrlHome_CtrlEnd_Move_To_Grid_Ends()
    {
        var cut = RenderDefault();
        TabbableCells(cut).Single().KeyDown(new KeyboardEventArgs { Key = "ArrowRight" });
        TabbableCells(cut).Single().KeyDown(new KeyboardEventArgs { Key = "End" });
        var afterEnd = TabbableCells(cut).Single();
        Assert.Equal("1", afterEnd.GetAttribute("data-row"));
        Assert.Equal("1", afterEnd.GetAttribute("data-col"));

        TabbableCells(cut).Single().KeyDown(new KeyboardEventArgs { Key = "Home", CtrlKey = true });
        var afterCtrlHome = TabbableCells(cut).Single();
        Assert.Equal("0", afterCtrlHome.GetAttribute("data-row"));
        Assert.Equal("0", afterCtrlHome.GetAttribute("data-col"));

        TabbableCells(cut).Single().KeyDown(new KeyboardEventArgs { Key = "End", CtrlKey = true });
        var afterCtrlEnd = TabbableCells(cut).Single();
        Assert.Equal("1", afterCtrlEnd.GetAttribute("data-row"));
        Assert.Equal("2", afterCtrlEnd.GetAttribute("data-col"));
    }

    // =====================================================================
    // §8.7-§8.9 — move menu
    // =====================================================================

    [Fact]
    public void Section_8_7_Enter_On_Focused_Card_Opens_Its_Move_Menu()
    {
        var cut = RenderDefault(labels: Labels);
        TabbableCells(cut).Single().KeyDown(new KeyboardEventArgs { Key = "Enter" });

        var button = cut.FindAll("button.kanban-board-move-button")
            .Single(b => b.GetAttribute("aria-label") == "Move Card One");
        Assert.Equal("true", button.GetAttribute("aria-expanded"));

        var listbox = cut.Find("ul.kanban-board-move-list");
        Assert.Equal("Move to column", listbox.GetAttribute("aria-label"));
        Assert.Equal(3, cut.FindAll("li.kanban-board-move-option").Count);
    }

    [Fact]
    public async Task Section_8_8_Choosing_Destination_Calls_OnMove_Closes_Menu_Refocuses_Button()
    {
        (string CardId, string ToColumnId)? captured = null;
        var cut = RenderDefault(
            labels: Labels,
            onMove: EventCallback.Factory.Create<(string, string)>(this, args => captured = args));

        TabbableCells(cut).Single().KeyDown(new KeyboardEventArgs { Key = "Enter" });
        var doneOption = cut.FindAll("li.kanban-board-move-option").Single(o => o.TextContent.Trim() == "Done");
        await doneOption.ClickAsync(new MouseEventArgs());

        Assert.Equal(("c1", "done"), captured);
        Assert.Empty(cut.FindAll("ul.kanban-board-move-list"));

        // bUnit has no live browser focus model (per the "invisible to
        // jsdom/bUnit" limitation noted in AGENTS.md) — refocus intent is
        // verified via the FocusAsync interop invocation's target id
        // matching the move button's own ElementReference id, the same
        // technique ThemePicker/DateTimePicker's suites use.
        var focusedIds = FocusedRefIds();
        Assert.NotEmpty(focusedIds);
        Assert.Equal(cut.Instance.MoveButtonReferenceId("c1"), focusedIds[^1]);
    }

    [Fact]
    public async Task Section_8_9_Escape_Closes_Move_Menu_Without_Calling_OnMove()
    {
        var called = false;
        var cut = RenderDefault(
            labels: Labels,
            onMove: EventCallback.Factory.Create<(string, string)>(this, _ => called = true));

        TabbableCells(cut).Single().KeyDown(new KeyboardEventArgs { Key = "Enter" });
        cut.Find("ul.kanban-board-move-list").KeyDown(new KeyboardEventArgs { Key = "Escape" });

        Assert.False(called);
        Assert.Empty(cut.FindAll("ul.kanban-board-move-list"));
        await Task.CompletedTask;
    }

    // =====================================================================
    // §8.10 — pointer drag-and-drop
    // =====================================================================

    [Fact]
    public async Task Section_8_10_Dropping_A_Card_On_Another_Columns_Cell_Calls_OnMove()
    {
        (string CardId, string ToColumnId)? captured = null;
        var cut = RenderDefault(onMove: EventCallback.Factory.Create<(string, string)>(this, args => captured = args));

        var cardTitle = cut.FindAll(".kanban-board-card-title").First(e => e.TextContent.Trim() == "Card One");
        await cardTitle.DragStartAsync(new DragEventArgs());

        var doneCell = BodyRows(cut).First().QuerySelectorAll(".kanban-table-td")[2];
        await doneCell.DropAsync(new DragEventArgs());

        Assert.Equal(("c1", "done"), captured);
    }

    // =====================================================================
    // §8.11-§8.12 — announcements and extra attributes
    // =====================================================================

    [Fact]
    public async Task Section_8_11_Successful_Move_Announces_Via_Labels_MoveAnnouncement()
    {
        var cut = RenderDefault(labels: Labels);
        TabbableCells(cut).Single().KeyDown(new KeyboardEventArgs { Key = "Enter" });
        var doneOption = cut.FindAll("li.kanban-board-move-option").Single(o => o.TextContent.Trim() == "Done");
        await doneOption.ClickAsync(new MouseEventArgs());

        Assert.Equal("Card One moved to Done", cut.Find(".kanban-board-status").TextContent);
    }

    [Fact]
    public void Section_8_11_No_Announcement_Fires_When_MoveAnnouncement_Absent()
    {
        var cut = RenderDefault();
        TabbableCells(cut).Single().KeyDown(new KeyboardEventArgs { Key = "Enter" });
        var listbox = cut.Find("ul.kanban-board-move-list");
        listbox.KeyDown(new KeyboardEventArgs { Key = "Enter" });

        Assert.Equal("", cut.Find(".kanban-board-status").TextContent);
    }

    [Fact]
    public void Section_8_12_Extra_Attributes_Spread_Onto_Root()
    {
        var cut = RenderComponent<KanbanBoard>(p => p
            .Add(x => x.Label, "Sprint board")
            .Add(x => x.Columns, Columns)
            .Add(x => x.Cards, Cards)
            .AddUnmatched("data-testid", "board-root"));

        Assert.NotNull(cut.Find("[data-testid='board-root']"));
    }

    // =====================================================================
    // Focus-interop helper — mirrors ThemePickerTests' own FocusedRefIds().
    // =====================================================================

    private const string FocusIdentifier = "Blazor._internal.domWrapper.focus";

    private IReadOnlyList<string> FocusedRefIds()
        => JSInterop.Invocations
            .Where(i => i.Identifier == FocusIdentifier)
            .Select(i => ((ElementReference)i.Arguments[0]!).Id)
            .ToList();
}
