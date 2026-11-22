// swift-tools-version: 6.0
// Lily Design System for Apple platforms (spec/apple-swift, tasks.md Phase 44). One package, several products, no third-party
// runtime dependency. LilyCore is pure Swift (no UI); LilyUI is SwiftUI components with style protocols.
import PackageDescription

let package = Package(
    name: "LilyDesignSystem",
    defaultLocalization: "en",
    platforms: [.iOS(.v18), .macOS(.v15)],
    products: [
        .library(name: "LilyCore", targets: ["LilyCore"]),
        .library(name: "LilyUI", targets: ["LilyUI"]),
    ],
    targets: [
        .target(name: "LilyCore"),
        .target(name: "LilyUI", dependencies: ["LilyCore"]),
        .testTarget(name: "LilyCoreTests", dependencies: ["LilyCore"], resources: [.copy("vectors")]),
        .testTarget(name: "LilyUITests", dependencies: ["LilyUI"]),
    ],
    swiftLanguageModes: [.v6]
)
