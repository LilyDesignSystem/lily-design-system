using Bunit;
using LilyBlazorHeadless.Components;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class ChatComposerTests : TestContext
{
    private IRenderedComponent<ChatComposer> Render(Action<Bunit.ComponentParameterCollectionBuilder<ChatComposer>>? extra = null) =>
        RenderComponent<ChatComposer>(p =>
        {
            p.Add(x => x.Label, "Message").Add(x => x.SendLabel, "Send").Add(x => x.StopLabel, "Stop");
            extra?.Invoke(p);
        });

    [Fact] public void Renders_form_with_base_class_a_named_textarea_and_one_button()
    {
        var c = Render();
        Assert.NotNull(c.Find("form.chat-composer"));
        Assert.Equal("Message", c.Find("textarea.chat-composer-input").GetAttribute("aria-label"));
        Assert.Single(c.FindAll("button"));
    }
    [Fact] public void Button_is_send_by_default()
    {
        var b = Render().Find("button");
        Assert.Equal("submit", b.GetAttribute("type"));
        Assert.Equal("send", b.GetAttribute("data-state"));
        Assert.Equal("Send", b.TextContent.Trim());
    }
    [Fact] public void Send_button_is_disabled_not_hidden_while_empty_or_whitespace()
    {
        Assert.True(Render().Find("button").HasAttribute("disabled"));
        Assert.True(Render(p => p.Add(x => x.Value, "   ")).Find("button").HasAttribute("disabled"));
        Assert.False(Render(p => p.Add(x => x.Value, "hi")).Find("button").HasAttribute("disabled"));
    }
    [Fact] public void Submitting_the_form_sends_the_value()
    {
        string? sent = null;
        var c = Render(p => p.Add(x => x.Value, "hello").Add(x => x.OnSend, EventCallback.Factory.Create<string>(this, v => sent = v)));
        c.Find("form").Submit();
        Assert.Equal("hello", sent);
    }
    [Fact] public void Ctrl_Enter_sends_but_plain_and_shift_Enter_do_not()
    {
        var sent = new List<string>();
        var c = Render(p => p.Add(x => x.Value, "hello").Add(x => x.OnSend, EventCallback.Factory.Create<string>(this, v => sent.Add(v))));
        c.Find("textarea").KeyDown(new KeyboardEventArgs { Key = "Enter" });
        c.Find("textarea").KeyDown(new KeyboardEventArgs { Key = "Enter", ShiftKey = true });
        Assert.Empty(sent);
        c.Find("textarea").KeyDown(new KeyboardEventArgs { Key = "Enter", CtrlKey = true });
        Assert.Equal(new[] { "hello" }, sent);
    }
    [Fact] public void Nothing_is_sent_when_empty_disabled_or_busy()
    {
        var sent = 0;
        var cb = EventCallback.Factory.Create<string>(this, _ => sent++);
        Render(p => p.Add(x => x.OnSend, cb)).Find("form").Submit();
        Render(p => p.Add(x => x.Value, "hi").Add(x => x.Disabled, true).Add(x => x.OnSend, cb)).Find("form").Submit();
        Render(p => p.Add(x => x.Value, "hi").Add(x => x.Busy, true).Add(x => x.OnSend, cb)).Find("form").Submit();
        Assert.Equal(0, sent);
    }
    [Fact] public void While_busy_the_button_becomes_stop()
    {
        var b = Render(p => p.Add(x => x.Busy, true).Add(x => x.Value, "x")).Find("button");
        Assert.Equal("button", b.GetAttribute("type"));
        Assert.Equal("stop", b.GetAttribute("data-state"));
        Assert.Equal("Stop", b.TextContent.Trim());
        Assert.False(b.HasAttribute("disabled"));
    }
    [Fact] public void Pressing_stop_raises_OnStop_and_never_OnSend()
    {
        var stops = 0; var sends = 0;
        var c = Render(p => p.Add(x => x.Busy, true).Add(x => x.Value, "x")
            .Add(x => x.OnStop, EventCallback.Factory.Create(this, () => stops++))
            .Add(x => x.OnSend, EventCallback.Factory.Create<string>(this, _ => sends++)));
        c.Find("button").Click();
        Assert.Equal(1, stops);
        Assert.Equal(0, sends);
    }
    [Fact] public void Rows_follow_lines_clamped_to_min_and_max()
    {
        Assert.Equal("2", Render(p => p.Add(x => x.MinRows, 2).Add(x => x.MaxRows, 4)).Find("textarea").GetAttribute("rows"));
        Assert.Equal("3", Render(p => p.Add(x => x.MinRows, 2).Add(x => x.MaxRows, 4).Add(x => x.Value, "a\nb\nc")).Find("textarea").GetAttribute("rows"));
        Assert.Equal("4", Render(p => p.Add(x => x.MinRows, 2).Add(x => x.MaxRows, 4).Add(x => x.Value, "a\nb\nc\nd\ne\nf")).Find("textarea").GetAttribute("rows"));
    }
    [Fact] public void Disabled_disables_textarea_and_button()
    {
        var c = Render(p => p.Add(x => x.Disabled, true).Add(x => x.Value, "x"));
        Assert.True(c.Find("textarea").HasAttribute("disabled"));
        Assert.True(c.Find("button").HasAttribute("disabled"));
    }
    [Fact] public void Passes_placeholder_and_name()
    {
        var t = Render(p => p.Add(x => x.Placeholder, "Ask").Add(x => x.Name, "msg")).Find("textarea");
        Assert.Equal("Ask", t.GetAttribute("placeholder"));
        Assert.Equal("msg", t.GetAttribute("name"));
    }
    [Fact] public void Typing_raises_ValueChanged()
    {
        string? seen = null;
        var c = Render(p => p.Add(x => x.ValueChanged, EventCallback.Factory.Create<string>(this, v => seen = v)));
        c.Find("textarea").Input("hello");
        Assert.Equal("hello", seen);
    }
    [Fact] public void Consumer_class_follows_base_class_and_rest_props_spread()
    {
        var f = Render(p => p.Add(x => x.CssClass, "mine").AddUnmatched("id", "cc1")).Find("form");
        Assert.Equal("chat-composer mine", f.GetAttribute("class"));
        Assert.Equal("cc1", f.Id);
    }
    [Fact] public void Child_content_renders_before_the_textarea()
    {
        var c = Render(p => p.AddChildContent("<span data-testid=\"extra\">E</span>"));
        Assert.Equal("extra", c.Find("form").FirstElementChild!.GetAttribute("data-testid"));
    }
}
