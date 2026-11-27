// QuantityInput (components/quantity-input-div): a number and its unit, such as a weight in kilograms or pounds, in a labelled
// group. Each unit carries its own limits; `problem` says what is wrong with the number as typed (tasks.md P62-T3).

import LilyCore
import SwiftUI

/// One unit a quantity may be given in, with the limits a number in it must keep to.
public struct QuantityUnit: Identifiable, Hashable, Sendable {
    public let value: String
    public let label: String
    public let min: Double?
    public let max: Double?
    public var id: String { value }

    public init(value: String, label: String, min: Double? = nil, max: Double? = nil) {
        self.value = value
        self.label = label
        self.min = min
        self.max = max
    }
}

public struct QuantityInput: View {
    private let label: String
    private let magnitudeLabel: String
    private let unitLabel: String?
    private let units: [QuantityUnit]
    private let error: String?
    @Binding private var magnitude: String
    @Binding private var unit: String

    /// - Parameters:
    ///   - label: names the quantity ("Your weight"); the group's accessibility label.
    ///   - magnitudeLabel: the number field's label ("Weight").
    ///   - unitLabel: the unit menu's label ("Weight unit"); needed when there is more than one unit.
    ///   - units: the units offered, each with its limits.
    ///   - magnitude: the number as typed, with a full stop for its decimal mark.
    ///   - unit: the chosen unit's `value`.
    ///   - error: the error, spoken in the hint and announced when it appears.
    public init(
        label: String, magnitudeLabel: String, unitLabel: String? = nil, units: [QuantityUnit], magnitude: Binding<String>,
        unit: Binding<String>, error: String? = nil
    ) {
        self.label = label
        self.magnitudeLabel = magnitudeLabel
        self.unitLabel = unitLabel
        self.units = units
        self.error = error
        self._magnitude = magnitude
        self._unit = unit
    }

    /// What is wrong with `magnitude` in `unit`, or nil; an unknown unit has no limits.
    public static func problem(magnitude: String, unit: String, units: [QuantityUnit]) throws(FormPartsError) -> QuantityProblem? {
        let chosen = units.first { $0.value == unit }
        return try quantityProblem(magnitude, min: chosen?.min, max: chosen?.max)
    }

    public var body: some View {
        let chosen = units.first { $0.value == unit } ?? units.first
        VStack(alignment: .leading, spacing: 4) {
            Text(verbatim: label).accessibilityHidden(true)
            if let error { Text(verbatim: error).bold().accessibilityHidden(true) }
            HStack(alignment: .bottom, spacing: 12) {
                VStack(alignment: .leading, spacing: 2) {
                    Text(verbatim: magnitudeLabel).font(.footnote).accessibilityHidden(true)
                    TextField("", text: $magnitude)
                        .lilyNumberKeyboard(decimal: true)
                        .frame(maxWidth: 120)
                        .textFieldStyle(.roundedBorder)
                        .accessibilityLabel(Text(verbatim: magnitudeLabel))
                        .accessibilityValue(Text(verbatim: LilySemantics.spoken(magnitude, units.count == 1 ? chosen?.label : nil) ?? ""))
                        .accessibilityHint(Text(verbatim: error ?? ""))
                }
                if units.count > 1 {
                    Picker(selection: $unit) {
                        ForEach(units) { Text(verbatim: $0.label).tag($0.value) }
                    } label: {
                        Text(verbatim: unitLabel ?? "")
                    }
                    .pickerStyle(.menu)
                    .accessibilityLabel(Text(verbatim: unitLabel ?? ""))
                } else if let chosen {
                    Text(verbatim: chosen.label).accessibilityHidden(true)
                }
            }
        }
        .accessibilityElement(children: .contain)
        .accessibilityLabel(Text(verbatim: label))
        .onAppear {
            if units.count > 1, (unitLabel ?? "").isEmpty { LilySemantics.warn(["QuantityInput: the unit menu needs a unitLabel"]) }
        }
        .onChange(of: error, LilySemantics.errorChanged)
    }
}
