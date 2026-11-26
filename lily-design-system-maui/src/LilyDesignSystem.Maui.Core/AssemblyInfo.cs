using System.Runtime.CompilerServices;

// The Blazor copies in Shared/ keep Blazor's internal helpers (RecordListState); the MAUI controls use them.
[assembly: InternalsVisibleTo("LilyDesignSystem.Maui")]
[assembly: InternalsVisibleTo("LilyDesignSystem.Maui.Tests")]
