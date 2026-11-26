using LilyDesignSystem.Maui.Core;

namespace LilyDesignSystem.Maui.Tests;

public class LilySemanticsTests
{
    [Fact]
    public void SpokenJoinsWithALineBreakAndDropsEmptyPieces()
    {
        Assert.Equal("Heading\nMessage", LilySemantics.Spoken("Heading", null, "", "Message"));
        Assert.Null(LilySemantics.Spoken(null, ""));
    }

    [Fact]
    public void AFieldIsNamedByLabelDescriptionRequiredWordThenError()
    {
        Assert.Equal("Email\nWe reply here\nrequired\nEnter an email address",
            LilySemantics.FieldDescription("Email", "We reply here", true, "required", "Enter an email address"));
        // No word for "required" from the app: Lily says nothing of its own.
        Assert.Equal("Email", LilySemantics.FieldDescription("Email", null, true, null, null));
    }

    [Fact]
    public void ABadgeLabelReplacesItsText()
    {
        Assert.Equal("3 unread messages", LilySemantics.BadgeLabel("3", "3 unread messages"));
        Assert.Equal("3", LilySemantics.BadgeLabel("3", ""));
    }

    [Fact]
    public void ATagSpeaksTextThenContext_OrContextThenStateWhenLive()
    {
        Assert.Equal("High\nPriority", LilySemantics.TagLabel("High", "Priority", live: false));
        Assert.Equal("Priority\nHigh", LilySemantics.TagLabel("High", "Priority", live: true));
    }
}
