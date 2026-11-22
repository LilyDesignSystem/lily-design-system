// The accessibility audit (XCUIApplication.performAccessibilityAudit) on the catalog and on every component's detail screen,
// at the default text size and the largest accessibility size (tasks.md P44-T5). An ignored issue would be listed here with a
// reason in `isIgnored`; the list may only shrink.

import XCTest

final class AccessibilityAuditTests: XCTestCase {
    /// Issues the audit reports that are not Lily's, each with its reason. Keep the list short and shrinking.
    @MainActor static func isIgnored(_ issue: XCUIAccessibilityAuditIssue, in app: XCUIApplication) -> Bool {
        guard issue.auditType == .contrast else { return false }
        // A contrast issue with no element: in every run (2026-11-22) these were rows fading under the system bars'
        // scroll-edge effect, at the top and the foot of a scrolled list. Lily's own colour pairs are checked by
        // LilyThemes' token tests (4.5:1 for text pairs and the link tint).
        guard let element = issue.element else { return true }
        // The system search field's own placeholder: iOS draws it, in its own grey.
        if element.elementType == .searchField { return true }
        // Text scrolled under the floating Liquid Glass search bar, which iOS blurs and fades (the scroll-edge effect).
        let bar = app.searchFields.firstMatch
        if bar.exists, element.frame.intersects(bar.frame.insetBy(dx: 0, dy: -60)) { return true }
        // The home indicator band at the foot of the screen.
        let window = app.windows.firstMatch.frame
        if element.frame.minY > window.maxY - 40 { return true }
        return false
    }

    private func launch(textSize: String? = nil) -> XCUIApplication {
        let app = XCUIApplication()
        if let textSize { app.launchArguments += ["-UIPreferredContentSizeCategoryName", textSize] }
        app.launch()
        return app
    }

    @MainActor private func audit(_ app: XCUIApplication) throws {
        try app.performAccessibilityAudit { issue in Self.isIgnored(issue, in: app) }
    }

    /// The catalog row at `index`, scrolled into reach and clear of the floating search bar (a tap on a row under the bar
    /// lands on the bar), or nil past the end of the list.
    @MainActor private func row(_ index: Int, in app: XCUIApplication) -> XCUIElement? {
        let row = app.buttons["example-row-\(index)"]
        let bar = app.searchFields.firstMatch
        for _ in 0..<20 {
            if row.exists && row.isHittable && (!bar.exists || row.frame.maxY < bar.frame.minY) { return row }
            app.collectionViews.firstMatch.swipeUp(velocity: .slow)
        }
        return row.exists && row.isHittable ? row : nil
    }

    @MainActor func testTheCatalogPassesTheAudit() throws {
        let app = launch()
        XCTAssertTrue(app.navigationBars["Components"].waitForExistence(timeout: 10))
        try audit(app)
    }

    @MainActor func testEveryDetailScreenPassesTheAuditAtTwoTextSizes() throws {
        // Each detail screen is reached from a fresh launch, so a failure on one does not hide the others.
        for textSize in [nil, "UICTContentSizeCategoryAccessibilityXXXL"] {
            var index = 0
            while true {
                let app = launch(textSize: textSize)
                XCTAssertTrue(app.navigationBars["Components"].waitForExistence(timeout: 10))
                guard let row = row(index, in: app) else {
                    app.terminate()
                    break
                }
                row.tap()
                // Wait for the detail screen, so the audit covers it rather than the catalog mid-transition.
                // (The catalog's navigation bar, not its title text: a detail screen's back button can show that word.)
                let catalogTitle = app.navigationBars["Components"]
                let gone = NSPredicate(format: "exists == false")
                expectation(for: gone, evaluatedWith: catalogTitle)
                waitForExpectations(timeout: 10)
                try audit(app)
                app.terminate()
                index += 1
            }
            XCTAssertGreaterThan(index, 10, "too few catalog rows were reached at \(textSize ?? "the default size")")
        }
    }
}
