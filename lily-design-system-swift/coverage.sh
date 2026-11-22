#!/bin/sh
# Test coverage for the Swift package. LilyCore must stay at 100% of lines and regions; the other products' report is printed (LilyUI's
# SwiftUI-invoked handler thunks run only in a live app, so they are covered by the example app's UI tests, tasks.md P44-T5).
set -eu
cd "$(dirname "$0")"
swift test --enable-code-coverage >/dev/null
products="$(dirname "$(dirname "$(swift test --show-codecov-path)")")"
report="$(xcrun llvm-cov report "$products/LilyCoreTests.xctest/Contents/MacOS/LilyCoreTests" \
    -object "$products/LilyUITests.xctest/Contents/MacOS/LilyUITests" \
    -object "$products/LilyUIExamplesTests.xctest/Contents/MacOS/LilyUIExamplesTests" \
    -object "$products/LilyThemesTests.xctest/Contents/MacOS/LilyThemesTests" \
    -instr-profile "$products/codecov/default.profdata" -ignore-filename-regex='Tests/|\.build/')"
printf '%s\n' "$report"
short="$(printf '%s\n' "$report" | awk '$1 ~ /^LilyCore\// && ($4 != "100.00%" || $10 != "100.00%") { print $1 }')"
if [ -n "$short" ]; then
    echo "coverage.sh: LilyCore below 100%: $short" >&2
    exit 1
fi
