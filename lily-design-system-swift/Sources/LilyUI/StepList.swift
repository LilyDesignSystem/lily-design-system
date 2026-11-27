// StepList (components/step-list): the steps of a task and where the person is, each step saying its status in the consumer's
// words, never by colour or a tick alone (tasks.md P62-T3, shared/form-parts.ts).

import LilyCore
import SwiftUI

public struct StepList: View {
    private let label: String
    private let steps: [String]
    private let current: Int
    private let statusLabel: (StepStatus) -> String

    /// - Parameters:
    ///   - label: the list's accessibility label ("Questions").
    ///   - steps: each step's name, in order.
    ///   - current: the current step's index, from 0.
    ///   - statusLabel: the words for each status ("Done", "Now", "To do"), spoken after the step's name.
    public init(label: String, steps: [String], current: Int, statusLabel: @escaping (StepStatus) -> String) {
        self.label = label
        self.steps = steps
        self.current = current
        self.statusLabel = statusLabel
    }

    /// Each step's status, by the shared rules; a current index out of range is a warning and every step waiting.
    public static func statuses(count: Int, current: Int) -> [StepStatus] {
        do throws(FormPartsError) {
            return try (0..<count).map { index throws(FormPartsError) in try stepStatus(index: index, current: current) }
        } catch {
            LilySemantics.warn(["StepList: current \(current) is not a step"])
            return Array(repeating: .waiting, count: count)
        }
    }

    public var body: some View {
        let statuses = Self.statuses(count: steps.count, current: current)
        VStack(alignment: .leading, spacing: 6) {
            ForEach(steps.indices, id: \.self) { index in
                HStack(spacing: 8) {
                    Text(verbatim: steps[index]).fontWeight(statuses[index] == .inProgress ? .bold : .regular)
                    Text(verbatim: statusLabel(statuses[index])).font(.footnote)
                }
                .accessibilityElement(children: .combine)
                .accessibilityAddTraits(statuses[index] == .inProgress ? .isSelected : [])
            }
        }
        .accessibilityElement(children: .contain)
        .accessibilityLabel(Text(verbatim: label))
    }
}
