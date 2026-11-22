// Search for the example catalog, on LilyCore's shared search (tasks.md P43-T3), so the catalog filters as the web catalogs do.

import LilyCore

enum LilySearch {
    static func matches(_ text: String, _ query: String) -> Bool { matchesSearch(text, query) }
}
