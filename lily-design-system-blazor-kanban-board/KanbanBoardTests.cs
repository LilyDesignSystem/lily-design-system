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
    public void Section_8_5_Roving_Tab_Stop_Is_Not_Announced_As_Selection()
    {
        // Focus is not selection: the cursor cell is the tab stop only.
        var cut = RenderDefault();
        Assert.Single(TabbableCells(cut));
        Assert.Empty(cut.FindAll("td[aria-selected]"));
    }

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
    // Focus, tab stop and move edge cases
    // =====================================================================

    /// <summary>
    /// A parent that owns the cards and applies each move, so the moved card
    /// arrives in the same render batch as the move itself — as it would from
    /// a real consumer.
    /// </summary>
    private sealed class MovingHost : ComponentBase
    {
        [Parameter] public KanbanLabels? Labels { get; set; }
        private IReadOnlyList<KanbanCard> _cards = Cards;

        protected override void BuildRenderTree(Microsoft.AspNetCore.Components.Rendering.RenderTreeBuilder builder)
        {
            builder.OpenComponent<KanbanBoard>(0);
            builder.AddAttribute(1, nameof(KanbanBoard.Label), "Sprint board");
            builder.AddAttribute(2, nameof(KanbanBoard.Columns), Columns);
            builder.AddAttribute(3, nameof(KanbanBoard.Cards), _cards);
            builder.AddAttribute(4, nameof(KanbanBoard.Labels), Labels ?? new KanbanLabels());
            builder.AddAttribute(5, nameof(KanbanBoard.OnMove), EventCallback.Factory.Create<(string CardId, string ToColumnId)>(this, args =>
            {
                _cards = _cards
                    .Select(c => c.Id == args.CardId ? new KanbanCard { Id = c.Id, ColumnId = args.ToColumnId, Title = c.Title } : c)
                    .ToList();
            }));
            builder.CloseComponent();
        }
    }

    [Fact]
    public async Task Section_8_8_After_A_Move_Focus_And_The_Tab_Stop_Follow_The_Card()
    {
        var host = RenderComponent<MovingHost>(p => p.Add(x => x.Labels, Labels));
        var board = host.FindComponent<KanbanBoard>();

        board.FindAll(".kanban-table-td[tabindex='0']").Single().KeyDown(new KeyboardEventArgs { Key = "Enter" });
        var doneOption = board.FindAll("li.kanban-board-move-option").Single(o => o.TextContent.Trim() == "Done");
        await doneOption.ClickAsync(new MouseEventArgs());

        var tabbable = board.FindAll(".kanban-table-td[tabindex='0']");
        Assert.Single(tabbable);
        Assert.Equal("2", tabbable[0].GetAttribute("data-col"));
        Assert.Equal(board.Instance.MoveButtonReferenceId("c1"), FocusedRefIds()[^1]);
    }

    [Fact]
    public async Task Section_8_15_Choosing_The_Cards_Own_Column_Or_Dropping_It_There_Is_Not_A_Move()
    {
        (string, string)? captured = null;
        var cut = RenderDefault(
            labels: Labels,
            onMove: EventCallback.Factory.Create<(string, string)>(this, args => captured = args));

        TabbableCells(cut).Single().KeyDown(new KeyboardEventArgs { Key = "Enter" });
        var todoOption = cut.FindAll("li.kanban-board-move-option").Single(o => o.TextContent.Trim() == "To Do");
        await todoOption.ClickAsync(new MouseEventArgs());
        Assert.Empty(cut.FindAll("ul.kanban-board-move-list"));
        Assert.Equal("", cut.Find(".kanban-board-status").TextContent);

        var cardTitle = cut.FindAll(".kanban-board-card-title").First(e => e.TextContent.Trim() == "Card One");
        await cardTitle.DragStartAsync(new DragEventArgs());
        await BodyRows(cut).ElementAt(1).QuerySelectorAll(".kanban-table-td")[0].DropAsync(new DragEventArgs());

        Assert.Null(captured);
    }

    [Fact]
    public void Section_8_16_When_The_Board_Shrinks_Under_The_Cursor_One_Cell_Stays_Tabbable()
    {
        var cut = RenderDefault();
        TabbableCells(cut).Single().KeyDown(new KeyboardEventArgs { Key = "End" });
        Assert.Equal("1", TabbableCells(cut).Single().GetAttribute("data-row"));

        cut.SetParametersAndRender(p => p.Add(x => x.Cards, Cards.Where(c => c.Id != "c2" && c.Id != "c4").ToList()));

        Assert.Single(BodyRows(cut));
        Assert.Single(TabbableCells(cut));
    }

    [Fact]
    public async Task Section_8_16_Focusing_A_Cell_By_Pointer_Moves_The_Cursor_There()
    {
        var cut = RenderDefault();
        var cell = BodyRows(cut).ElementAt(1).QuerySelectorAll(".kanban-table-td")[1];
        await cell.TriggerEventAsync("onfocusin", new FocusEventArgs());

        var tabbable = TabbableCells(cut).Single();
        Assert.Equal("1", tabbable.GetAttribute("data-row"));
        Assert.Equal("1", tabbable.GetAttribute("data-col"));
    }

    [Fact]
    public void Section_8_13_Without_MoveButton_Label_No_Unnamed_Button_And_Menu_Is_Named_By_The_Card()
    {
        var cut = RenderDefault();
        Assert.Empty(cut.FindAll(".kanban-board-move-button"));

        TabbableCells(cut).Single().KeyDown(new KeyboardEventArgs { Key = "Enter" });
        Assert.Equal("Card One", cut.Find("ul.kanban-board-move-list").GetAttribute("aria-label"));

        cut.Find("ul.kanban-board-move-list").KeyDown(new KeyboardEventArgs { Key = "Escape" });
        // No button to return to: focus goes back to the card's own cell.
        var cellId = TabbableCells(cut).Single().GetAttribute("id")!;
        Assert.Contains(
            JSInterop.Invocations.Where(i => i.Identifier == "eval"),
            i => ((string)i.Arguments[0]!).Contains(cellId));
    }

    [Fact]
    public void Section_8_3_A_Column_Exactly_At_Its_WipLimit_Is_Not_Over_It()
    {
        var cut = RenderComponent<KanbanBoard>(p => p
            .Add(x => x.Label, "Sprint board")
            .Add(x => x.Columns, Columns)
            .Add(x => x.Cards, Cards.Where(c => c.Id != "c4").ToList())
            .Add(x => x.Labels, Labels));

        Assert.False(cut.FindAll(".kanban-table-th")[1].HasAttribute("data-over-limit"));
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

public class KanbanBoardInteractionTests : TestContext
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

    private static readonly KanbanLabels BaseLabels = new()
    {
        MoveButton = card => $"Move {card.Title}",
        MoveMenuLabel = "Move to column",
        MoveAnnouncement = (title, column) => $"{title} moved to {column}",
        MoveBlocked = (title, column) => $"{title} cannot go to {column}",
        ReorderAnnouncement = (title, position, total) => $"{title} is {position} of {total}",
    };

    public KanbanBoardInteractionTests()
    {
        JSInterop.Mode = JSRuntimeMode.Loose;
        JSInterop.SetupVoid("eval", _ => true).SetVoidResult();
    }

    private IRenderedComponent<KanbanBoard> Render(Action<ComponentParameterCollectionBuilder<KanbanBoard>>? configure = null)
        => RenderComponent<KanbanBoard>(p =>
        {
            p.Add(x => x.Label, "Sprint board");
            p.Add(x => x.Columns, Columns);
            p.Add(x => x.Cards, Cards);
            p.Add(x => x.Labels, BaseLabels);
            configure?.Invoke(p);
        });

    private static AngleSharp.Dom.IElement Tabbable(IRenderedComponent<KanbanBoard> cut)
        => cut.FindAll(".kanban-table-td[tabindex='0']").Single();

    [Fact]
    public void Section_8_17_Alt_ArrowDown_Reorders_Within_The_Column_And_Announces_It()
    {
        (string, int)? captured = null;
        var cut = Render(p => p.Add(x => x.OnReorder, EventCallback.Factory.Create<(string, int)>(this, a => captured = a)));

        Tabbable(cut).KeyDown(new KeyboardEventArgs { Key = "ArrowDown", AltKey = true });

        Assert.Equal(("c1", 1), captured);
        Assert.Equal("Card One is 2 of 2", cut.Find(".kanban-board-status").TextContent);
    }

    [Fact]
    public void Section_8_18_Alt_Arrow_At_The_Column_Edge_Does_Not_Reorder()
    {
        (string, int)? captured = null;
        var cut = Render(p => p.Add(x => x.OnReorder, EventCallback.Factory.Create<(string, int)>(this, a => captured = a)));

        Tabbable(cut).KeyDown(new KeyboardEventArgs { Key = "ArrowUp", AltKey = true });

        Assert.Null(captured);
    }

    [Fact]
    public async Task Section_8_19_CanMove_Refuses_A_Move_With_An_Announcement_And_An_Aria_Disabled_Option()
    {
        (string, string)? moved = null;
        var cut = Render(p =>
        {
            p.Add(x => x.CanMove, (card, column) => column.Id != "done");
            p.Add(x => x.OnMove, EventCallback.Factory.Create<(string, string)>(this, a => moved = a));
        });

        Tabbable(cut).KeyDown(new KeyboardEventArgs { Key = "Enter" });
        var done = cut.FindAll("li.kanban-board-move-option").Single(o => o.TextContent.Trim() == "Done");
        Assert.Equal("true", done.GetAttribute("aria-disabled"));
        await done.ClickAsync(new MouseEventArgs());

        Assert.Null(moved);
        Assert.Equal("Card One cannot go to Done", cut.Find(".kanban-board-status").TextContent);
    }

    [Fact]
    public void Section_8_20_Readonly_Renders_No_Move_Button_Menu_Drag_Or_Reorder()
    {
        (string, int)? captured = null;
        var cut = Render(p =>
        {
            p.Add(x => x.Readonly, true);
            p.Add(x => x.OnReorder, EventCallback.Factory.Create<(string, int)>(this, a => captured = a));
        });

        Assert.Empty(cut.FindAll(".kanban-board-move-button"));
        Tabbable(cut).KeyDown(new KeyboardEventArgs { Key = "Enter" });
        Assert.Empty(cut.FindAll("ul.kanban-board-move-list"));
        Tabbable(cut).KeyDown(new KeyboardEventArgs { Key = "ArrowDown", AltKey = true });
        Assert.Null(captured);
        Assert.Empty(cut.FindAll("[draggable='true']"));
        Assert.True(cut.Find("div.kanban-board").HasAttribute("data-readonly"));
    }

    [Fact]
    public void Section_8_21_Readonly_Keeps_Arrow_Key_Navigation()
    {
        var cut = Render(p => p.Add(x => x.Readonly, true));

        Tabbable(cut).KeyDown(new KeyboardEventArgs { Key = "ArrowRight" });

        Assert.Equal("1", Tabbable(cut).GetAttribute("data-col"));
    }

    // =====================================================================
    // Round 2 — collapse, add card, hard limits (§8.22–§8.30)
    // =====================================================================


    private IRenderedComponent<KanbanBoard> RenderR2(
        Action<ComponentParameterCollectionBuilder<KanbanBoard>>? configure = null,
        KanbanLabels? labels = null,
        IReadOnlyList<KanbanColumn>? columns = null)
        => RenderComponent<KanbanBoard>(p =>
        {
            p.Add(x => x.Label, "Sprint board");
            p.Add(x => x.Columns, columns ?? Columns);
            p.Add(x => x.Cards, Cards);
            p.Add(x => x.Labels, labels ?? BaseLabels with { MoveBlocked = (t, c) => $"{t} cannot go to {c}" });
            configure?.Invoke(p);
        });

    private static readonly KanbanLabels CollapseLabels = BaseLabels with
    {
        CardCount = count => $"{count} cards",
        CollapseColumn = (c, collapsed) => $"{(collapsed ? "Expand" : "Collapse")} {c.Title}",
    };

    private static AngleSharp.Dom.IElement NamedButton(IRenderedComponent<KanbanBoard> cut, string name)
        => cut.FindAll("button").First(b => b.GetAttribute("aria-label") == name);

    private static IReadOnlyList<KanbanColumn> StrictColumns(int limit) => new[]
    {
        new KanbanColumn { Id = "todo", Title = "To Do" },
        new KanbanColumn { Id = "doing", Title = "In Progress", WipLimit = limit, StrictLimit = true },
    };

    [Fact]
    public void Section_8_22_No_Collapse_Toggle_Without_Labels_CollapseColumn()
    {
        var cut = RenderR2();
        Assert.Empty(cut.FindAll(".kanban-board-collapse-button"));
    }

    [Fact]
    public void Section_8_23_The_Toggle_Collapses_A_Column()
    {
        var cut = RenderR2(labels: CollapseLabels);
        Assert.Equal("true", NamedButton(cut, "Collapse To Do").GetAttribute("aria-expanded"));
        Assert.Contains("Card One", cut.Markup);

        NamedButton(cut, "Collapse To Do").Click();

        Assert.Equal("false", NamedButton(cut, "Expand To Do").GetAttribute("aria-expanded"));
        Assert.DoesNotContain("Card One", cut.Markup);
        Assert.Contains("2 cards", cut.FindAll(".kanban-table-th")[0].TextContent);
        Assert.NotNull(cut.FindAll(".kanban-table-th")[0].GetAttribute("data-collapsed"));
    }

    [Fact]
    public void Section_8_24_CollapsedColumns_Starts_A_Column_Collapsed_And_Its_Cells_Carry_Data_Collapsed()
    {
        var cut = RenderR2(p => p.Add(x => x.CollapsedColumns, new[] { "todo" }));
        Assert.DoesNotContain("Card One", cut.Markup);
        Assert.All(cut.FindAll(".kanban-table-td[data-col='0']"), c => Assert.NotNull(c.GetAttribute("data-collapsed")));
    }

    [Fact]
    public void Section_8_25_The_Boards_Height_Ignores_Collapsed_Columns()
    {
        Assert.Equal(2, BodyRowsOf(RenderR2()).Count());
        Assert.Empty(BodyRowsOf(RenderR2(p => p.Add(x => x.CollapsedColumns, new[] { "todo", "doing" }))));
    }

    private static IEnumerable<AngleSharp.Dom.IElement> BodyRowsOf(IRenderedComponent<KanbanBoard> cut)
        => cut.FindAll(".kanban-table-body .kanban-table-row");

    [Fact]
    public void Section_8_26_AddCard_Renders_An_Add_Button_Per_Column_That_Raises_OnAddCard()
    {
        string? added = null;
        var cut = RenderR2(labels: BaseLabels with { AddCard = c => $"Add to {c.Title}" }, configure: p =>
        {
            p.Add(x => x.OnAddCard, EventCallback.Factory.Create<string>(this, id => added = id));
        });

        NamedButton(cut, "Add to In Progress").Click();

        Assert.Equal("doing", added);
    }

    [Fact]
    public void Section_8_27_No_Add_Button_Without_Labels_AddCard_Or_When_Readonly()
    {
        Assert.Empty(RenderR2().FindAll(".kanban-board-add-button"));
        var readonlyCut = RenderR2(labels: BaseLabels with { AddCard = c => $"Add to {c.Title}" }, configure: p => p.Add(x => x.Readonly, true));
        Assert.Empty(readonlyCut.FindAll(".kanban-board-add-button"));
    }

    [Fact]
    public async Task Section_8_28_StrictLimit_Refuses_A_Move_Into_A_Full_Column()
    {
        (string, string)? moved = null;
        var cut = RenderR2(columns: StrictColumns(2), configure: p => p.Add(x => x.OnMove, EventCallback.Factory.Create<(string, string)>(this, a => moved = a)));

        Tabbable(cut).KeyDown(new KeyboardEventArgs { Key = "Enter" });
        var option = cut.FindAll("li.kanban-board-move-option").Single(o => o.TextContent.Trim() == "In Progress");
        Assert.Equal("true", option.GetAttribute("aria-disabled"));
        await option.ClickAsync(new MouseEventArgs());

        Assert.Null(moved);
        Assert.Equal("Card One cannot go to In Progress", cut.Find(".kanban-board-status").TextContent);
    }

    [Fact]
    public async Task Section_8_29_StrictLimit_Allows_A_Move_While_The_Column_Is_Under_Its_Limit()
    {
        (string, string)? moved = null;
        var cut = RenderR2(columns: StrictColumns(3), configure: p => p.Add(x => x.OnMove, EventCallback.Factory.Create<(string, string)>(this, a => moved = a)));

        Tabbable(cut).KeyDown(new KeyboardEventArgs { Key = "Enter" });
        await cut.FindAll("li.kanban-board-move-option").Single(o => o.TextContent.Trim() == "In Progress").ClickAsync(new MouseEventArgs());

        Assert.Equal(("c1", "doing"), moved);
    }

    [Fact]
    public async Task Section_8_30_Without_StrictLimit_A_Full_Column_Still_Accepts_Moves()
    {
        (string, string)? moved = null;
        var cut = RenderR2(p => p.Add(x => x.OnMove, EventCallback.Factory.Create<(string, string)>(this, a => moved = a)));

        Tabbable(cut).KeyDown(new KeyboardEventArgs { Key = "Enter" });
        await cut.FindAll("li.kanban-board-move-option").Single(o => o.TextContent.Trim() == "In Progress").ClickAsync(new MouseEventArgs());

        Assert.Equal(("c1", "doing"), moved);
    }

    // =====================================================================
    // Round 3 and consumer capabilities (§8.31–§8.62)
    // =====================================================================

    private static readonly IReadOnlyList<KanbanCard> RichCards = new[]
    {
        new KanbanCard { Id = "c1", ColumnId = "todo", Title = "Card One", Subtitle = "Source · 80", Badges = new[] { "P1", "VIP" }, Flag = "SLA breached", Href = "/t/1" },
        new KanbanCard { Id = "c2", ColumnId = "todo", Title = "Card Two" },
        new KanbanCard { Id = "c3", ColumnId = "doing", Title = "Card Three" },
    };

    private static readonly IReadOnlyList<KanbanColumn> RichColumns = new[]
    {
        new KanbanColumn { Id = "todo", Title = "To Do", Flag = "Over capacity", Accent = "red" },
        new KanbanColumn { Id = "doing", Title = "In Progress" },
        new KanbanColumn { Id = "done", Title = "Done" },
    };

    private IRenderedComponent<KanbanBoard> RenderRich(
        Action<ComponentParameterCollectionBuilder<KanbanBoard>>? configure = null,
        KanbanLabels? labels = null,
        IReadOnlyList<KanbanCard>? cards = null,
        IReadOnlyList<KanbanColumn>? columns = null)
        => RenderComponent<KanbanBoard>(p =>
        {
            p.Add(x => x.Label, "Board");
            p.Add(x => x.Columns, columns ?? RichColumns);
            p.Add(x => x.Cards, cards ?? RichCards);
            p.Add(x => x.Labels, labels ?? BaseLabels with { MoveBlocked = (t, c) => $"{t} cannot go to {c}" });
            configure?.Invoke(p);
        });

    private static AngleSharp.Dom.IElement CardCell(IRenderedComponent<KanbanBoard> cut, string id)
        => cut.Find($"[data-card-id='{id}']");

    private static AngleSharp.Dom.IElement CellAt(IRenderedComponent<KanbanBoard> cut, int row, int col)
        => cut.Find($".kanban-table-td[data-row='{row}'][data-col='{col}']");

    private static async Task FocusInAsync(AngleSharp.Dom.IElement el) => await el.TriggerEventAsync("onfocusin", new FocusEventArgs());

    [Fact]
    public void Filter_Hides_Cards_And_Counts_And_Limits_Still_Use_Every_Card_With_Data_Hidden_Count()
    {
        var cut = RenderRich(p => p.Add(x => x.Filter, c => c.ColumnId != "doing"), BaseLabels with { CardCount = n => $"{n} cards" });
        Assert.DoesNotContain("Card Three", cut.Markup);
        Assert.Contains("1 cards", cut.FindAll(".kanban-table-th")[1].TextContent);
        Assert.Equal("1", cut.FindAll(".kanban-table-th")[1].GetAttribute("data-hidden-count"));
        Assert.Null(cut.FindAll(".kanban-table-th")[0].GetAttribute("data-hidden-count"));
    }

    [Fact]
    public void Compare_Orders_The_Cards_Within_Each_Column()
    {
        var cut = RenderRich(p => p.Add(x => x.Compare, (a, b) => string.CompareOrdinal(b.Title, a.Title)));
        var todo = cut.FindAll(".kanban-table-td[data-col='0'] .kanban-board-card-title").Select(e => e.TextContent.Trim()).ToList();
        Assert.Equal(new[] { "Card Two", "Card One" }, todo);
    }

    [Fact]
    public async Task Dropping_On_A_Card_In_Another_Column_Raises_OnMoveAt_With_Its_Position_And_On_Its_Own_Column_Reorders()
    {
        (string, string, int)? moveAt = null;
        (string, int)? reordered = null;
        var cut = RenderRich(p =>
        {
            p.Add(x => x.OnMoveAt, EventCallback.Factory.Create<(string, string, int)>(this, a => moveAt = a));
            p.Add(x => x.OnReorder, EventCallback.Factory.Create<(string, int)>(this, a => reordered = a));
        });
        await CellAt(cut, 0, 0).QuerySelector(".kanban-board-card-title")!.TriggerEventAsync("ondragstart", new DragEventArgs());
        await CellAt(cut, 0, 1).TriggerEventAsync("ondrop", new DragEventArgs());
        Assert.Equal(("c1", "doing", 0), moveAt);

        await CellAt(cut, 0, 0).QuerySelector(".kanban-board-card-title")!.TriggerEventAsync("ondragstart", new DragEventArgs());
        await CellAt(cut, 1, 0).TriggerEventAsync("ondrop", new DragEventArgs());
        Assert.Equal(("c1", 1), reordered);
    }

    [Fact]
    public async Task A_Locked_Card_Has_Data_Locked_No_Move_Button_Ignores_Enter_And_Alt_Arrow()
    {
        var locked = RichCards.Select(c => c.Id == "c1" ? new KanbanCard { Id = c.Id, ColumnId = c.ColumnId, Title = c.Title, Locked = true } : c).ToList();
        (string, string)? moved = null;
        var cut = RenderRich(p => p.Add(x => x.OnMove, EventCallback.Factory.Create<(string, string)>(this, a => moved = a)), cards: locked);

        Assert.NotNull(CardCell(cut, "c1").GetAttribute("data-locked"));
        Assert.Empty(CardCell(cut, "c1").QuerySelectorAll(".kanban-board-move-button"));
        Assert.Null(CardCell(cut, "c1").QuerySelector(".kanban-board-card-title")!.GetAttribute("draggable"));
        CardCell(cut, "c1").KeyDown(new KeyboardEventArgs { Key = "Enter" });
        Assert.Empty(cut.FindAll("li.kanban-board-move-option"));
        CardCell(cut, "c1").KeyDown(new KeyboardEventArgs { Key = "ArrowRight", AltKey = true });
        Assert.Null(moved);
    }

    [Fact]
    public async Task Alt_ArrowRight_Moves_The_Card_To_The_Next_Column_And_A_Full_Hard_Limited_Column_Refuses_And_Announces()
    {
        (string, string)? moved = null;
        var cut = RenderRich(p => p.Add(x => x.OnMove, EventCallback.Factory.Create<(string, string)>(this, a => moved = a)));
        CellAt(cut, 0, 0).KeyDown(new KeyboardEventArgs { Key = "ArrowLeft", AltKey = true });
        Assert.Null(moved);
        CellAt(cut, 0, 0).KeyDown(new KeyboardEventArgs { Key = "ArrowRight", AltKey = true });
        Assert.Equal(("c1", "doing"), moved);

        (string, string)? refused = null;
        var strict = new[]
        {
            new KanbanColumn { Id = "todo", Title = "To Do" },
            new KanbanColumn { Id = "doing", Title = "In Progress", WipLimit = 1, StrictLimit = true },
        };
        var g = RenderRich(p => p.Add(x => x.OnMove, EventCallback.Factory.Create<(string, string)>(this, a => refused = a)), columns: strict);
        CellAt(g, 0, 0).KeyDown(new KeyboardEventArgs { Key = "ArrowRight", AltKey = true });
        Assert.Null(refused);
        Assert.Equal("Card One cannot go to In Progress", g.Find(".kanban-board-status").TextContent);
        await Task.CompletedTask;
    }

    [Fact]
    public void CardAttributes_Adds_Attributes_To_Each_Cards_Cell()
    {
        var cut = RenderRich(p => p.Add(x => x.CardAttributes, c => new Dictionary<string, object> { ["data-priority"] = c.Id == "c1" ? "high" : "low" }));
        Assert.Equal("high", CardCell(cut, "c1").GetAttribute("data-priority"));
        Assert.Equal("low", CardCell(cut, "c2").GetAttribute("data-priority"));
    }

    [Fact]
    public void Subtitle_Badges_A_Link_Title_A_Flag_With_Aria_Describedby_And_Column_Flag_And_Accent_Render()
    {
        var cut = RenderRich();
        Assert.Equal("Source · 80", CardCell(cut, "c1").QuerySelector(".kanban-board-card-subtitle")!.TextContent);
        Assert.Equal(new[] { "P1", "VIP" }, CardCell(cut, "c1").QuerySelectorAll(".kanban-board-card-badge").Select(b => b.TextContent).ToArray());
        Assert.Equal("/t/1", CardCell(cut, "c1").QuerySelector("a.kanban-board-card-link")!.GetAttribute("href"));
        var flag = CardCell(cut, "c1").QuerySelector(".kanban-board-card-flag")!;
        Assert.Equal("SLA breached", flag.TextContent);
        Assert.Equal("SLA breached", CardCell(cut, "c1").GetAttribute("data-flag"));
        Assert.Equal(flag.Id, CardCell(cut, "c1").GetAttribute("aria-describedby"));
        var th = cut.FindAll(".kanban-table-th")[0];
        Assert.Equal("Over capacity", th.GetAttribute("data-flag"));
        Assert.Equal("red", th.GetAttribute("data-accent"));
        Assert.Equal("Over capacity", th.QuerySelector(".kanban-board-column-flag")!.TextContent);
        Assert.Equal("red", CardCell(cut, "c1").GetAttribute("data-accent"));
    }

    [Fact]
    public void CardTemplate_Replaces_The_Title_Content_And_ColumnHeader_And_ColumnFooter_Render_Per_Column()
    {
        var cut = RenderRich(p =>
        {
            p.Add(x => x.CardTemplate, ctx => builder => builder.AddMarkupContent(0, $"<b data-custom>{ctx.Label}!</b>"));
            p.Add(x => x.ColumnHeader, ctx => builder => builder.AddMarkupContent(0, $"<i data-header>{ctx.Count}</i>"));
            p.Add(x => x.ColumnFooter, ctx => builder => builder.AddMarkupContent(0, $"<i data-footer='{ctx.Column.Id}'>{ctx.Count}:{string.Join(",", ctx.Cards.Select(c => c.Id))}</i>"));
        });
        Assert.Equal("Card Two!", CardCell(cut, "c2").QuerySelector("[data-custom]")!.TextContent);
        Assert.Equal(3, cut.FindAll("tfoot td").Count);
        Assert.Equal("2:c1,c2", cut.Find("[data-footer='todo']").TextContent);
        Assert.Equal("1", cut.FindAll("[data-header]")[1].TextContent);
    }

    [Fact]
    public async Task AllowedColumns_Limits_The_Move_Menu_And_A_Keyboard_Move_Elsewhere_Is_Refused_And_Announced()
    {
        var cut = RenderRich(p => p.Add(x => x.AllowedColumns, c => c.Id == "c1" ? new[] { "doing" } : new[] { "done" }));
        CardCell(cut, "c1").KeyDown(new KeyboardEventArgs { Key = "Enter" });
        Assert.Equal(new[] { "To Do", "In Progress" }, cut.FindAll("li.kanban-board-move-option").Select(o => o.TextContent.Trim()).ToArray());

        (string, string)? moved = null;
        var g = RenderRich(p =>
        {
            p.Add(x => x.AllowedColumns, _ => new[] { "done" });
            p.Add(x => x.OnMove, EventCallback.Factory.Create<(string, string)>(this, a => moved = a));
        });
        CellAt(g, 0, 0).KeyDown(new KeyboardEventArgs { Key = "ArrowRight", AltKey = true });
        Assert.Null(moved);
        Assert.Equal("Card One cannot go to In Progress", g.Find(".kanban-board-status").TextContent);
        await Task.CompletedTask;
    }

    [Fact]
    public void Draggable_False_Stops_Pointer_Dragging_But_Keeps_The_Move_Menu()
    {
        var cards = RichCards.Select(c => c.Id == "c2" ? new KanbanCard { Id = c.Id, ColumnId = c.ColumnId, Title = c.Title, Draggable = false } : c).ToList();
        var cut = RenderRich(cards: cards, labels: BaseLabels);
        Assert.Null(CardCell(cut, "c2").QuerySelector(".kanban-board-card-title")!.GetAttribute("draggable"));
        Assert.NotNull(CardCell(cut, "c2").QuerySelector(".kanban-board-move-button"));
    }

    [Fact]
    public async Task An_Async_MoveHandler_Shows_Data_Pending_In_The_New_Column_Then_Clears_On_Completion()
    {
        var tcs = new TaskCompletionSource();
        var cut = RenderRich(p => p.Add(x => x.MoveHandler, (_, _, _) => tcs.Task),
            BaseLabels with { MovePending = (t, c) => $"Moving {t} to {c}" });
        await FocusInAsync(CardCell(cut, "c2"));
        CardCell(cut, "c2").KeyDown(new KeyboardEventArgs { Key = "ArrowRight", AltKey = true });
        cut.WaitForAssertion(() => Assert.NotNull(CardCell(cut, "c2").GetAttribute("data-pending")));
        Assert.Equal("true", CardCell(cut, "c2").GetAttribute("aria-busy"));
        Assert.Equal("1", CardCell(cut, "c2").GetAttribute("data-col"));
        Assert.Equal("Moving Card Two to In Progress", cut.Find(".kanban-board-status").TextContent);
        tcs.SetResult();
        cut.WaitForAssertion(() => Assert.Null(CardCell(cut, "c2").GetAttribute("data-pending")));
    }

    [Fact]
    public async Task A_Failing_MoveHandler_Sends_The_Card_Back_Announces_MoveFailed_And_Raises_OnMoveError_And_A_Pending_Card_Cannot_Move_Again()
    {
        var tcs = new TaskCompletionSource();
        var calls = 0;
        (string, string, Exception)? error = null;
        var cut = RenderRich(p =>
        {
            p.Add(x => x.MoveHandler, (_, _, _) => { calls++; return tcs.Task; });
            p.Add(x => x.OnMoveError, EventCallback.Factory.Create<(string, string, Exception)>(this, a => error = a));
        }, BaseLabels with { MoveFailed = (t, c, _) => $"Could not move {t} to {c}" });
        await FocusInAsync(CardCell(cut, "c2"));
        CardCell(cut, "c2").KeyDown(new KeyboardEventArgs { Key = "ArrowRight", AltKey = true });
        cut.WaitForAssertion(() => Assert.Equal("1", CardCell(cut, "c2").GetAttribute("data-col")));
        CardCell(cut, "c2").KeyDown(new KeyboardEventArgs { Key = "ArrowRight", AltKey = true });
        Assert.Equal(1, calls);
        tcs.SetException(new InvalidOperationException("no"));
        cut.WaitForAssertion(() => Assert.Equal("0", CardCell(cut, "c2").GetAttribute("data-col")));
        Assert.Equal("c2", error?.Item1);
        Assert.Equal("Could not move Card Two to In Progress", cut.Find(".kanban-board-status").TextContent);
    }

    [Fact]
    public async Task Without_A_MoveHandler_There_Is_No_Pending_State()
    {
        (string, string)? moved = null;
        var cut = RenderRich(p => p.Add(x => x.OnMove, EventCallback.Factory.Create<(string, string)>(this, a => moved = a)));
        await FocusInAsync(CardCell(cut, "c2"));
        CardCell(cut, "c2").KeyDown(new KeyboardEventArgs { Key = "ArrowRight", AltKey = true });
        Assert.Equal(("c2", "doing"), moved);
        Assert.Empty(cut.FindAll("[data-pending]"));
    }

    [Fact]
    public void Labels_EmptyColumn_Shows_A_Message_In_An_Empty_Column_Even_When_No_Column_Has_Cards()
    {
        var lab = BaseLabels with { EmptyColumn = c => $"No cards in {c.Title}" };
        var cut = RenderRich(labels: lab);
        Assert.Equal("No cards in Done", cut.Find(".kanban-board-empty").TextContent);

        var empty = RenderRich(labels: lab, cards: Array.Empty<KanbanCard>());
        Assert.Equal(3, empty.FindAll(".kanban-board-empty").Count);
        Assert.Single(empty.FindAll(".kanban-table-body .kanban-table-row"));

        Assert.Empty(RenderRich().FindAll(".kanban-board-empty"));
    }

    [Fact]
    public void Labels_Search_Adds_A_Search_Field_That_Filters_By_Label_Subtitle_And_Badges()
    {
        var cut = RenderRich(labels: BaseLabels with { Search = "Search cards" });
        var input = cut.Find("input[type='search']");
        Assert.Equal("Search cards", input.GetAttribute("aria-label"));
        input.Input("vip");
        Assert.Equal(new[] { "Card One" }, cut.FindAll(".kanban-board-card-title").Select(e => e.TextContent.Trim()).ToArray());
        Assert.Equal("1", cut.FindAll(".kanban-table-th")[0].GetAttribute("data-hidden-count"));
    }

    // ---- 0.4.0 (§8.63–§8.83) ----

    private IRenderedComponent<KanbanBoard> RenderV4(System.Action<ComponentParameterCollectionBuilder<KanbanBoard>>? configure = null, IReadOnlyList<KanbanCard>? cards = null)
        => RenderComponent<KanbanBoard>(p =>
        {
            p.Add(x => x.Label, "Board");
            p.Add(x => x.Columns, Columns);
            p.Add(x => x.Cards, cards ?? Cards);
            configure?.Invoke(p);
        });

    [Fact]
    public void Selectable_X_And_Ctrl_Click_Toggle_And_Selected_Updates()
    {
        IReadOnlyList<string> selected = new List<string>();
        var cut = RenderV4(p =>
        {
            p.Add(x => x.Selectable, true);
            p.Add(x => x.SelectedChanged, EventCallback.Factory.Create<IReadOnlyList<string>>(this, v => selected = v));
        });
        Assert.Equal("true", cut.Find("table").GetAttribute("aria-multiselectable"));
        CardCell(cut, "c1").FocusIn(new FocusEventArgs());
        Tabbable(cut).KeyDown(new KeyboardEventArgs { Key = "x" });
        Assert.Equal(new[] { "c1" }, selected.ToArray());
        CardCell(cut, "c2").Click(new MouseEventArgs { CtrlKey = true });
        Assert.Equal(new[] { "c1", "c2" }, selected.ToArray());
        Assert.NotNull(CardCell(cut, "c1").GetAttribute("data-selected"));
    }

    [Fact]
    public void Moving_A_Selected_Card_Moves_The_Whole_Selection_And_Announces_Once()
    {
        var moves = new List<(string, string)>();
        var cut = RenderV4(p =>
        {
            p.Add(x => x.Selectable, true);
            p.Add(x => x.Selected, new[] { "c1", "c2" });
            p.Add(x => x.OnMove, EventCallback.Factory.Create<(string, string)>(this, m => moves.Add(m)));
            p.Add(x => x.Labels, BaseLabels with { MoveManyAnnouncement = (n, c) => $"{n} to {c}" });
        });
        CardCell(cut, "c1").FocusIn(new FocusEventArgs());
        Tabbable(cut).KeyDown(new KeyboardEventArgs { Key = "ArrowRight", AltKey = true });
        Assert.Equal(new[] { ("c1", "doing"), ("c2", "doing") }, moves.ToArray());
        Assert.Equal("2 to In Progress", cut.Find(".kanban-board-status").TextContent);
    }

    [Fact]
    public void Undoable_Ctrl_Z_Moves_The_Card_Back()
    {
        var moves = new List<(string, string)>();
        var cut = RenderV4(p =>
        {
            p.Add(x => x.Undoable, true);
            p.Add(x => x.Labels, BaseLabels with { Undo = "Undo" });
            p.Add(x => x.OnMove, EventCallback.Factory.Create<(string, string)>(this, m => moves.Add(m)));
        });
        Assert.NotNull(cut.Find(".kanban-board-undo-button").GetAttribute("disabled"));
        CardCell(cut, "c1").FocusIn(new FocusEventArgs());
        Tabbable(cut).KeyDown(new KeyboardEventArgs { Key = "ArrowRight", AltKey = true });
        // the consumer owns Cards: put the card where the move left it
        cut.SetParametersAndRender(p => p.Add(x => x.Cards, Cards.Select(c => c.Id == "c1" ? new KanbanCard { Id = "c1", ColumnId = "doing", Title = c.Title } : c).ToList()));
        Tabbable(cut).KeyDown(new KeyboardEventArgs { Key = "z", CtrlKey = true });
        Assert.Equal(new[] { ("c1", "doing"), ("c1", "todo") }, moves.ToArray());
    }

    [Fact]
    public void MovableColumns_Alt_Shift_ArrowRight_Reorders_Columns()
    {
        IReadOnlyList<string> order = new List<string>();
        var cut = RenderV4(p =>
        {
            p.Add(x => x.MovableColumns, true);
            p.Add(x => x.ColumnOrderChanged, EventCallback.Factory.Create<IReadOnlyList<string>>(this, v => order = v));
        });
        CardCell(cut, "c1").FocusIn(new FocusEventArgs());
        Tabbable(cut).KeyDown(new KeyboardEventArgs { Key = "ArrowRight", AltKey = true, ShiftKey = true });
        Assert.Equal(new[] { "doing", "todo", "done" }, order.ToArray());
        Assert.Contains("In Progress", cut.FindAll(".kanban-table-th")[0].TextContent);
    }

    [Fact]
    public void Lanes_Render_Header_Rows_And_Group_Cards_By_LaneId()
    {
        var cards = Cards.Select((c, i) => new KanbanCard { Id = c.Id, ColumnId = c.ColumnId, Title = c.Title, LaneId = i < 2 ? "a" : "b" }).ToList();
        var cut = RenderV4(p => p.Add(x => x.Lanes, new[] { new KanbanLane { Id = "a", Title = "Alpha" }, new KanbanLane { Id = "b", Title = "Beta" } }), cards);
        Assert.Equal(new[] { "Alpha", "Beta" }, cut.FindAll(".kanban-board-lane").Select(e => e.TextContent.Trim()).ToArray());
    }

    [Fact]
    public void Dropping_Into_Another_Lanes_Cell_Raises_OnMoveToLane()
    {
        var landed = new List<(string, string, string)>();
        var cards = new[] { new KanbanCard { Id = "c1", ColumnId = "todo", Title = "One", LaneId = "a" } };
        var cut = RenderV4(p =>
        {
            p.Add(x => x.Lanes, new[] { new KanbanLane { Id = "a", Title = "A" }, new KanbanLane { Id = "b", Title = "B" } });
            p.Add(x => x.OnMoveToLane, EventCallback.Factory.Create<(string, string, string)>(this, m => landed.Add(m)));
        }, cards);
        cut.Find(".kanban-board-card-title").DragStart(new DragEventArgs());
        cut.Find("[data-row='1'][data-col='1']").Drop(new DragEventArgs());
        Assert.Equal(new[] { ("c1", "doing", "b") }, landed.ToArray());
    }

    [Fact]
    public void Virtualize_Renders_A_Window_With_Spacers_And_AriaRowcount()
    {
        var many = Enumerable.Range(0, 100).Select(i => new KanbanCard { Id = $"k{i}", ColumnId = "todo", Title = $"K{i}" }).ToList();
        var cut = RenderV4(p => p.Add(x => x.Virtualize, new KanbanVirtualize(20, 100)), many);
        Assert.NotEmpty(cut.FindAll(".kanban-board-scroll"));
        Assert.True(cut.FindAll("[data-card-id]").Count < 20);
        Assert.NotEmpty(cut.FindAll(".kanban-board-spacer"));
        Assert.Equal("101", cut.Find("table").GetAttribute("aria-rowcount"));
    }

    // ---- Collapsible lanes ----

    private static readonly KanbanLane[] LaneDefs = { new() { Id = "ann", Title = "Ann" }, new() { Id = "bo", Title = "Bo" } };

    private static readonly KanbanColumn[] LaneColumns = { new() { Id = "todo", Title = "To do" }, new() { Id = "doing", Title = "Doing" } };

    private static readonly KanbanCard[] CardsInLanes =
    {
        new() { Id = "c1", ColumnId = "todo", Title = "One", LaneId = "ann" },
        new() { Id = "c2", ColumnId = "todo", Title = "Two", LaneId = "bo" },
        new() { Id = "c3", ColumnId = "doing", Title = "Three", LaneId = "bo" },
    };

    private IRenderedComponent<KanbanBoard> RenderLanes(Action<ComponentParameterCollectionBuilder<KanbanBoard>>? configure = null, KanbanLabels? labels = null)
        => RenderComponent<KanbanBoard>(p =>
        {
            p.Add(x => x.Label, "Board");
            p.Add(x => x.Columns, LaneColumns);
            p.Add(x => x.Cards, CardsInLanes);
            p.Add(x => x.Lanes, LaneDefs);
            if (labels is not null) p.Add(x => x.Labels, labels);
            configure?.Invoke(p);
        });

    private static readonly KanbanLabels LaneLabels = new()
    {
        CollapseLane = (lane, collapsed) => $"{(collapsed ? "Expand" : "Collapse")} {lane.Title}",
        LaneCount = (lane, n) => $"{n} cards in {lane.Title}",
    };

    private static AngleSharp.Dom.IElement? CardIn(IRenderedComponent<KanbanBoard> cut, string id)
        => cut.FindAll($"[data-card-id='{id}']").FirstOrDefault();

    [Fact]
    public void Section_8_91_CollapseLane_Gates_A_Toggle_With_AriaExpanded_Clicking_Collapses_The_Lanes_Rows_But_Keeps_Its_Header()
    {
        var cut = RenderLanes(labels: LaneLabels);
        var toggle = cut.Find("button[aria-label='Collapse Bo']");
        Assert.Equal("true", toggle.GetAttribute("aria-expanded"));
        toggle.Click();
        Assert.Equal("false", cut.Find("button[aria-label='Expand Bo']").GetAttribute("aria-expanded"));
        Assert.Null(CardIn(cut, "c2"));
        Assert.NotNull(CardIn(cut, "c1"));
        Assert.Equal(2, cut.FindAll(".kanban-board-lane").Count);
    }

    [Fact]
    public void Section_8_92_No_Toggle_Without_CollapseLane()
    {
        var cut = RenderLanes();
        Assert.Empty(cut.FindAll(".kanban-board-lane-toggle"));
    }

    [Fact]
    public void Section_8_93_CollapsedLanes_Starts_A_Lane_Collapsed_LaneCount_Shows_Its_Count_And_The_Change_Is_Raised()
    {
        IReadOnlyList<string> changed = new List<string> { "unset" };
        var cut = RenderLanes(p =>
        {
            p.Add(x => x.CollapsedLanes, new[] { "bo" });
            p.Add(x => x.CollapsedLanesChanged, EventCallback.Factory.Create<IReadOnlyList<string>>(this, v => changed = v));
        }, LaneLabels);
        Assert.Null(CardIn(cut, "c2"));
        Assert.Equal(new[] { "1 cards in Ann", "2 cards in Bo" }, cut.FindAll(".kanban-board-lane-count").Select(e => e.TextContent.Trim()).ToArray());
        Assert.NotNull(cut.Find("[data-lane-id='bo'][data-collapsed]"));
        cut.Find("button[aria-label='Expand Bo']").Click();
        Assert.Empty(changed);
    }

    [Fact]
    public void Section_8_94_Collapsing_Every_Lane_Leaves_A_Board_With_Only_Headers()
    {
        var cut = RenderLanes(p => p.Add(x => x.CollapsedLanes, new[] { "ann", "bo" }));
        Assert.Empty(cut.FindAll(".kanban-table-body tr:not([data-lane-row])"));
        Assert.Equal(2, cut.FindAll(".kanban-board-lane").Count);
    }

    // =====================================================================
    // §8.95-§8.109 — typed fields, inline editing, export
    // =====================================================================

    private static readonly IReadOnlyList<DataGridColumn> FieldDefs = new[]
    {
        new DataGridColumn { Id = "owner", Header = "Owner", Type = DataGridCellType.Select, Editable = true, Options = new[] { new DataGridOption("a", "Ann"), new DataGridOption("b", "Bo") } },
        new DataGridColumn { Id = "points", Header = "Points", Type = DataGridCellType.Number, Editable = true },
        new DataGridColumn { Id = "due", Header = "Due", Type = DataGridCellType.Date, Editable = true },
    };

    private static DataGridRow Values(params (string Key, object? Value)[] values)
        => new(values.Select(v => new KeyValuePair<string, object?>(v.Key, v.Value)));

    private static readonly IReadOnlyList<KanbanCard> FieldCards = new[]
    {
        new KanbanCard { Id = "c1", ColumnId = "todo", Title = "One", Subtitle = "sub", Badges = new[] { "x", "y" }, Flag = "Late", Values = Values(("owner", "a"), ("points", 3), ("due", "2026-10-16")) },
        new KanbanCard { Id = "c2", ColumnId = "todo", Title = "Two", Values = Values(("points", 5)) },
        new KanbanCard { Id = "c3", ColumnId = "done", Title = "Three =cmd", Values = Values(("owner", "b")) },
    };

    private static readonly KanbanLabels ExportLabels = new()
    {
        Export = "Export",
        ExportCsv = "CSV",
        ExportTsv = "TSV",
        ExportExcel = "Excel",
        ExportHeaders = new KanbanExportHeaders("Title", "Column", Subtitle: "Sub", Badges: "Badges", Flag: "Flag"),
        ExportAnnouncement = (format, count, name) => $"{count} cards as {format.ToString().ToLowerInvariant()}: {name}",
        EditAnnouncement = (card, field, text) => $"{card} {field} is {text}",
        EditInvalid = (card, field) => $"{card}: bad {field}",
    };

    private IRenderedComponent<KanbanBoard> RenderFields(Action<ComponentParameterCollectionBuilder<KanbanBoard>>? configure = null, bool editable = true, List<KanbanFieldEdit>? edits = null,
        IReadOnlyList<DataGridColumn>? fields = null, IReadOnlyList<KanbanCard>? cards = null, KanbanLabels? labels = null)
        => RenderComponent<KanbanBoard>(p =>
        {
            p.Add(x => x.Label, "B");
            p.Add(x => x.Columns, Columns);
            p.Add(x => x.Cards, cards ?? FieldCards);
            p.Add(x => x.Fields, fields ?? FieldDefs);
            p.Add(x => x.Labels, labels ?? ExportLabels);
            if (editable) p.Add(x => x.OnFieldEdit, EventCallback.Factory.Create<KanbanFieldEdit>(this, e => edits?.Add(e)));
            configure?.Invoke(p);
        });

    private static AngleSharp.Dom.IElement CellOf(IRenderedComponent<KanbanBoard> cut, string id) => cut.Find($"[data-card-id='{id}']");

    private static string Normalise(string text) => System.Text.RegularExpressions.Regex.Replace(text, @"\s+", " ").Trim();

    [Fact]
    public void Section_8_95_Fields_Render_Under_The_Title_As_Text_Named_By_Their_Header()
    {
        var cut = RenderFields(editable: false);
        var fields = CellOf(cut, "c1").QuerySelectorAll(".kanban-board-card-field").Select(f => Normalise(f.TextContent)).ToArray();
        Assert.Equal(new[] { "Owner Ann", "Points 3", "Due 2026-10-16" }, fields);
        Assert.Single(CellOf(cut, "c3").QuerySelectorAll(".kanban-board-card-field")); // empty fields stay out of read-only cards
    }

    [Fact]
    public void Section_8_96_A_Field_Is_Editable_Only_With_A_Handler_And_Not_In_A_Readonly_Board()
    {
        Assert.Empty(RenderFields(editable: false).FindAll(".kanban-board-field-button"));
        Assert.Empty(RenderFields(p => p.Add(x => x.Readonly, true)).FindAll(".kanban-board-field-button"));
        Assert.NotEmpty(RenderFields().FindAll(".kanban-board-field-button"));
    }

    [Fact]
    public void Section_8_97_Clicking_A_Value_Opens_A_Typed_Editor_And_Enter_Commits_The_Parsed_Value()
    {
        var edits = new List<KanbanFieldEdit>();
        var cut = RenderFields(edits: edits);
        cut.FindAll("[data-card-id='c1'] .kanban-board-field-button")[1].Click();
        var input = cut.Find("input.kanban-board-field-editor");
        Assert.Equal("number", input.GetAttribute("type"));
        Assert.Equal("Points", input.GetAttribute("aria-label"));
        input.Input("8");
        input.KeyDown(new KeyboardEventArgs { Key = "Enter" });
        var edit = Assert.Single(edits);
        Assert.Equal(("c1", "points"), (edit.CardId, edit.FieldId));
        Assert.Equal(8.0, edit.Value);
        Assert.Equal(3, edit.Previous);
        Assert.Equal("One Points is 8", cut.Find(".kanban-board-status").TextContent);
        Assert.Empty(cut.FindAll(".kanban-board-field-editor"));
    }

    [Fact]
    public void Section_8_98_A_Select_Field_Edits_Through_A_Select_Of_Its_Options()
    {
        var edits = new List<KanbanFieldEdit>();
        var cut = RenderFields(edits: edits);
        cut.FindAll("[data-card-id='c2'] .kanban-board-field-button")[0].Click();
        cut.Find("select.kanban-board-field-editor").Change("b");
        var edit = Assert.Single(edits);
        Assert.Equal(("c2", "owner", "b"), (edit.CardId, edit.FieldId, (string?)edit.Value));
        Assert.Null(edit.Previous);
    }

    [Fact]
    public void Section_8_99_Escape_Cancels_Without_Reporting_And_An_Unchanged_Value_Reports_Nothing()
    {
        var edits = new List<KanbanFieldEdit>();
        var cut = RenderFields(edits: edits);
        void Open() => cut.FindAll("[data-card-id='c1'] .kanban-board-field-button")[1].Click();
        Open();
        cut.Find(".kanban-board-field-editor").Input("9");
        cut.Find(".kanban-board-field-editor").KeyDown(new KeyboardEventArgs { Key = "Escape" });
        Assert.Empty(edits);
        Open();
        cut.Find(".kanban-board-field-editor").KeyDown(new KeyboardEventArgs { Key = "Enter" });
        Assert.Empty(edits);
    }

    [Fact]
    public void Section_8_100_A_Date_Field_Edits_Through_A_Date_Input_And_Commits_The_Civil_Date()
    {
        var edits = new List<KanbanFieldEdit>();
        var cut = RenderFields(edits: edits);
        cut.FindAll("[data-card-id='c1'] .kanban-board-field-button")[2].Click();
        var input = cut.Find("input.kanban-board-field-editor");
        Assert.Equal("date", input.GetAttribute("type"));
        input.Input("2026-10-17");
        input.KeyDown(new KeyboardEventArgs { Key = "Enter" });
        var edit = Assert.Single(edits);
        Assert.Equal("2026-10-17", edit.Value);
        Assert.Equal("2026-10-16", edit.Previous);
    }

    [Fact]
    public void Section_8_101_A_Number_That_Does_Not_Fit_The_Type_Is_Refused_The_Editor_Stays_Open_And_The_Refusal_Is_Announced()
    {
        var edits = new List<KanbanFieldEdit>();
        var cut = RenderFields(edits: edits,
            fields: new[] { new DataGridColumn { Id = "p", Header = "P", Type = DataGridCellType.Number, Editable = true, Parse = (_, _) => double.NaN } },
            cards: new[] { new KanbanCard { Id = "c1", ColumnId = "todo", Title = "One", Values = Values(("p", 1)) } });
        cut.Find(".kanban-board-field-button").Click();
        cut.Find(".kanban-board-field-editor").KeyDown(new KeyboardEventArgs { Key = "Enter" });
        Assert.Empty(edits);
        Assert.NotNull(cut.Find(".kanban-board-field-editor"));
        Assert.Equal("One: bad P", cut.Find(".kanban-board-status").TextContent);
    }

    [Fact]
    public void Section_8_102_F2_On_A_Card_Edits_Its_First_Editable_Field_And_The_Editors_Keys_Do_Not_Reach_The_Grid()
    {
        var cut = RenderFields();
        cut.Find("[role='grid']").KeyDown(new KeyboardEventArgs { Key = "F2" });
        var editor = cut.Find(".kanban-board-field-editor");
        Assert.Equal("SELECT", editor.TagName);
        editor.KeyDown(new KeyboardEventArgs { Key = "ArrowDown" });
        Assert.Empty(cut.FindAll(".kanban-board-move-list"));
        Assert.Equal("0", CellOf(cut, "c1").GetAttribute("tabindex"));
    }

    [Fact]
    public void Section_8_103_IME_Enter_While_Composing_Does_Not_Commit()
    {
        var edits = new List<KanbanFieldEdit>();
        var cut = RenderFields(edits: edits,
            fields: new[] { new DataGridColumn { Id = "n", Header = "N", Editable = true } },
            cards: new[] { new KanbanCard { Id = "c1", ColumnId = "todo", Title = "One", Values = Values(("n", "a")) } });
        cut.Find(".kanban-board-field-button").Click();
        var input = cut.Find(".kanban-board-field-editor");
        input.Input("かな");
        input.KeyDown(new KeyboardEventArgs { Key = "Process" });
        Assert.Empty(edits);
        input.KeyDown(new KeyboardEventArgs { Key = "Enter" });
        var edit = Assert.Single(edits);
        Assert.Equal("かな", edit.Value);
        Assert.Equal("a", edit.Previous);
    }

    [Fact]
    public void Section_8_104_A_Locked_Cards_Fields_Are_Not_Editable()
    {
        var cut = RenderFields(cards: new[] { new KanbanCard { Id = "c1", ColumnId = "todo", Title = "One", Locked = true, Values = Values(("points", 3)) } });
        Assert.Empty(cut.FindAll(".kanban-board-field-button"));
    }

    private (DataGridExport File, string Text) Exported(Action<ComponentParameterCollectionBuilder<KanbanBoard>>? configure = null, string format = "csv",
        IReadOnlyList<DataGridColumn>? fields = null, KanbanLabels? labels = null)
    {
        DataGridExport? captured = null;
        var cut = RenderFields(p =>
        {
            p.Add(x => x.ExportHandler, file => { captured = file; return false; });
            configure?.Invoke(p);
        }, fields: fields, labels: labels);
        cut.Find($"[data-kanban-export-format='{format}']").Click();
        Assert.NotNull(captured);
        return (captured!, System.Text.Encoding.UTF8.GetString(captured!.Bytes));
    }

    [Fact]
    public void Section_8_105_Export_Buttons_Need_A_Label_And_ExportHeaders_Each_Label_Gates_Its_Button()
    {
        Assert.Empty(RenderFields(labels: new KanbanLabels()).FindAll(".kanban-board-export"));
        Assert.Empty(RenderFields(labels: new KanbanLabels { ExportCsv = "CSV" }).FindAll(".kanban-board-export"));
        var cut = RenderFields(labels: new KanbanLabels { Export = "Export", ExportExcel = "Excel", ExportHeaders = ExportLabels.ExportHeaders });
        Assert.Equal("Export", cut.Find("[role='group'].kanban-board-export").GetAttribute("aria-label"));
        Assert.Single(cut.FindAll(".kanban-board-export-button"));
    }

    [Fact]
    public void Section_8_106_Csv_Holds_Title_Column_Subtitle_Badges_Flag_And_The_Typed_Fields_Column_By_Column()
    {
        var (file, text) = Exported();
        Assert.Equal("kanban-board.csv", file.Filename);
        Assert.Equal(3, file.RowCount);
        Assert.Equal(
            "\uFEFFTitle,Column,Sub,Badges,Flag,Owner,Points,Due\r\n" +
            "One,To Do,sub,x; y,Late,Ann,3,2026-10-16\r\n" +
            "Two,To Do,,,,,5,\r\n" +
            "Three =cmd,Done,,,,Bo,,\r\n",
            text);
    }

    [Fact]
    public void Section_8_107_The_View_Is_Exported_ExportScope_Selected_Exports_Only_The_Selection_And_Exportable_False_Drops_A_Field()
    {
        var searched = Exported(p => p.Add(x => x.SearchValue, "two"));
        Assert.Equal(1, searched.File.RowCount);
        var picked = Exported(p => { p.Add(x => x.Selectable, true); p.Add(x => x.Selected, new[] { "c3" }); p.Add(x => x.ExportScope, KanbanExportScope.Selected); });
        Assert.Equal(1, picked.File.RowCount);
        var dropped = Exported(fields: new[] { FieldDefs[0] with { Exportable = false }, FieldDefs[1] });
        Assert.Equal("\uFEFFTitle,Column,Sub,Badges,Flag,Points", dropped.Text.Split("\r\n")[0]);
    }

    [Fact]
    public void Section_8_108_Lanes_Add_A_Lane_Column_Saving_Announces_Unless_The_Handler_Vetoes_And_An_Empty_View_Disables_The_Buttons()
    {
        var lanes = new[] { new KanbanLane { Id = "l1", Title = "Lane 1" } };
        var withLane = Exported(p => p.Add(x => x.Lanes, lanes),
            labels: ExportLabels with { ExportHeaders = new KanbanExportHeaders("Title", "Column", "Lane", "Sub", "Badges", "Flag") });
        Assert.Equal("\uFEFFTitle,Column,Lane,Sub,Badges,Flag,Owner,Points,Due", withLane.Text.Split("\r\n")[0]);

        var cut = RenderFields();
        cut.Find("[data-kanban-export-format='tsv']").Click();
        Assert.Equal("3 cards as tsv: kanban-board.tsv", cut.Find(".kanban-board-status").TextContent);

        var empty = RenderFields(cards: Array.Empty<KanbanCard>());
        Assert.NotNull(empty.Find("[data-kanban-export-format='csv'][disabled]"));
    }

    [Fact]
    public void Section_8_109_Blur_Commits_And_Moving_On_Keeps_The_Value()
    {
        var edits = new List<KanbanFieldEdit>();
        var cut = RenderFields(edits: edits);
        cut.FindAll("[data-card-id='c1'] .kanban-board-field-button")[1].Click();
        var input = cut.Find(".kanban-board-field-editor");
        input.Input("7");
        input.Blur();
        var edit = Assert.Single(edits);
        Assert.Equal(7.0, edit.Value);
    }
}
