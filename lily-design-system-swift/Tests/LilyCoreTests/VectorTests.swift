// Replays shared/vectors/*.json (copied here by bin/sync-shared-modules) against LilyCore, so the Swift port behaves as the
// TypeScript does (tasks.md P43-T3, P44-T2). A vector file this runner does not know, or a function it cannot call, fails.

import Foundation
import Testing

@testable import LilyCore

private struct Unknown: Error, CustomStringConvertible {
    let description: String
}

private func loadVectorFiles() throws -> [(name: String, cases: [[String: Any]])] {
    let dir = try #require(Bundle.module.url(forResource: "vectors", withExtension: nil))
    let names = try FileManager.default.contentsOfDirectory(atPath: dir.path).filter { $0.hasSuffix(".json") }.sorted()
    return try names.map { name in
        let data = try Data(contentsOf: dir.appendingPathComponent(name))
        let file = try #require(try JSONSerialization.jsonObject(with: data) as? [String: Any])
        return (name, try #require(file["cases"] as? [[String: Any]]))
    }
}

private func date(_ value: Any) throws -> Date {
    let formatter = ISO8601DateFormatter()
    formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
    let plain = ISO8601DateFormatter()
    guard let text = value as? String, let date = formatter.date(from: text) ?? plain.date(from: text) else {
        throw ClinicalFormatError.notAPartialDate(String(describing: value))
    }
    return date
}

private func number(_ value: Any) -> Double? { (value as? NSNumber)?.doubleValue }

/// Calls the named function with JSON arguments and returns a JSON-shaped result (NSNull for nil).
private func call(_ fn: String, _ args: [Any]) throws -> Any {
    func string(_ i: Int) -> String { args[i] as! String }
    switch fn {
    case "foldText": return foldText(string(0))
    case "searchTerms": return searchTerms(string(0))
    case "matchesSearch": return matchesSearch(string(0), string(1))
    case "highlightSegments":
        return highlightSegments(string(0), string(1)).map { ["text": $0.text, "match": $0.match] as [String: Any] }
    case "splitGraphemes": return splitGraphemes(string(0))
    case "truncateMiddleByClusters":
        let options = args[1] as! [String: Any]
        let strategy = (options["strategy"] as? String).flatMap(TruncationStrategy.init(rawValue:)) ?? .even
        return truncateMiddle(
            string(0), ellipsis: options["ellipsis"] as! String, maxWidth: number(options["maxWidth"]!)!,
            strategy: strategy, end: (options["end"] as? NSNumber)?.intValue, measure: { Double($0.count) })
    case "meterScale":
        let units = args[3] as? [String: Any]
        guard
            let scale = meterScale(
                number(args[0]), low: number(args[1]), high: number(args[2]),
                valueUnit: units?["value"] as? String, rangeUnit: units?["range"] as? String)
        else { return NSNull() }
        var out: [String: Any] = ["min": scale.min, "max": scale.max]
        if let low = scale.low { out["low"] = low }
        if let high = scale.high { out["high"] = high }
        return out
    case "ageParts":
        return try ageParts(birth: date(args[0]), at: date(args[1])).map {
            ["value": $0.value, "unit": $0.unit.rawValue] as [String: Any]
        }
    case "toIsoDuration":
        let parts = (args[0] as! [[String: Any]]).map {
            AgePart(value: ($0["value"] as! NSNumber).intValue, unit: AgeUnit(rawValue: $0["unit"] as! String)!)
        }
        return toIsoDuration(parts)
    case "partialDatePrecision": return try partialDatePrecision(string(0)).rawValue
    case "durationParts":
        let p = try durationParts(string(0))
        return [
            "years": p.years, "months": p.months, "weeks": p.weeks, "days": p.days, "hours": p.hours,
            "minutes": p.minutes, "seconds": p.seconds, "negative": p.negative,
        ] as [String: Any]
    case "htmlDuration":
        guard let d = htmlDuration(string(0)) else { return NSNull() }
        return ["datetime": d.datetime, "negative": d.negative] as [String: Any]
    case "isTypeaheadKey":
        let event = args[0] as! [String: Any]
        let native = event["nativeEvent"] as? [String: Any]
        return isTypeaheadKey(
            event["key"] as! String, control: event["ctrlKey"] as? Bool ?? false, option: event["altKey"] as? Bool ?? false,
            command: event["metaKey"] as? Bool ?? false,
            composing: (event["isComposing"] as? Bool ?? false) || (native?["isComposing"] as? Bool ?? false))
    case "nextTypeaheadState":
        let previous = args[0] as! [String: Any]
        let state = nextTypeaheadState(
            TypeaheadState(prefix: previous["prefix"] as! String, at: (previous["at"] as! NSNumber).intValue),
            key: string(1), now: (args[2] as! NSNumber).intValue, resetMilliseconds: (args[3] as! NSNumber).intValue)
        return ["prefix": state.prefix, "at": state.at] as [String: Any]
    case "findTypeaheadMatch":
        return findTypeaheadMatch(args[0] as! [String], from: (args[1] as! NSNumber).intValue, prefix: string(2))
    case "logicalKey": return logicalKey(string(0), rightToLeft: args[1] as! Bool)
    default: throw Unknown(description: "unknown vector function \(fn)")
    }
}

/// JSON equality through a round trip, so numbers compare by value (2 and 2.0 alike) and dictionaries ignore order.
private func same(_ a: Any, _ b: Any) throws -> Bool {
    let wrap = { (x: Any) throws -> Any in
        try JSONSerialization.jsonObject(with: JSONSerialization.data(withJSONObject: [x]), options: [])
    }
    return (try wrap(a) as! NSArray).isEqual(try wrap(b) as! NSArray)
}

@Test func everyVectorFileIsReadAndPasses() throws {
    let files = try loadVectorFiles()
    #expect(Set(files.map(\.name)) == ["clinical-format.json", "middle-truncation.json", "search-text.json", "typeahead.json"])
    var count = 0
    for file in files {
        for (index, c) in file.cases.enumerated() {
            let fn = c["fn"] as! String
            let args = c["args"] as! [Any]
            let label = "\(file.name) #\(index) \(fn)(\(args))"
            if c["throws"] as? Bool == true {
                #expect(throws: (any Error).self, "\(label) should throw") { _ = try call(fn, args) }
            } else {
                let result = try call(fn, args)
                #expect(try same(result, c["expected"]!), "\(label): got \(result), expected \(c["expected"]!)")
            }
            count += 1
        }
    }
    #expect(count == files.reduce(0) { $0 + $1.cases.count })
    #expect(count >= 142)
}
