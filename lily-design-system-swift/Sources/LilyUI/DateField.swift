// DateField (components/date-field): a date asked for as typed parts, day, month and year, in the reader's order, inside a
// labelled group. Easier than a calendar for a date a person knows by heart. The value is ISO 8601 once every part is a number,
// else ""; whether it is a real day is `isCalendarDate`'s, and the app's to say (tasks.md P62-T3, shared/form-parts.ts).

import LilyCore
import SwiftUI

public struct DateField: View {
    private let label: String
    private let labels: [DateFieldPart: String]
    private let order: DateFieldOrder
    private let precision: DateFieldPrecision
    private let description: String?
    private let error: String?
    @Binding private var value: String
    @State private var parts = DateParts()

    /// - Parameters:
    ///   - label: names the whole date ("Date of birth"); the group's accessibility label.
    ///   - dayLabel, monthLabel, yearLabel: each part's label, in the consumer's language; only those the precision asks for
    ///     are needed.
    ///   - order: the order the reader writes a date in; the consumer's, never assumed.
    ///   - precision: `.day` (all three parts), `.month` or `.year`.
    ///   - value: YYYY-MM-DD, YYYY-MM or YYYY once its parts are numbers, else "".
    ///   - description: help text, such as an example date, spoken as the group's hint.
    ///   - error: the error, spoken first in the hint and announced when it appears.
    public init(
        label: String, dayLabel: String? = nil, monthLabel: String? = nil, yearLabel: String, order: DateFieldOrder,
        precision: DateFieldPrecision = .day, value: Binding<String>, description: String? = nil, error: String? = nil
    ) {
        self.label = label
        var labels: [DateFieldPart: String] = [.year: yearLabel]
        labels[.month] = monthLabel
        labels[.day] = dayLabel
        self.labels = labels
        self.order = order
        self.precision = precision
        self.description = description
        self.error = error
        self._value = value
    }

    /// Words a part needs but was not given, for a development warning.
    public static func warnings(precision: DateFieldPrecision, labels: [DateFieldPart: String]) -> [String] {
        datePartsShown(precision).filter { (labels[$0] ?? "").isEmpty }.map { "DateField: the \($0.rawValue) part needs a label" }
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(verbatim: label).accessibilityHidden(true)
            if let description { Text(verbatim: description).font(.footnote).accessibilityHidden(true) }
            if let error { Text(verbatim: error).bold().accessibilityHidden(true) }
            HStack(alignment: .bottom, spacing: 12) {
                ForEach(dateSequence(order, precision), id: \.self) { part in
                    VStack(alignment: .leading, spacing: 2) {
                        Text(verbatim: labels[part] ?? "").font(.footnote).accessibilityHidden(true)
                        TextField("", text: binding(part))
                            .lilyNumberKeyboard(decimal: false)
                            .frame(width: part == .year ? 72 : 48)
                            .textFieldStyle(.roundedBorder)
                            .accessibilityLabel(Text(verbatim: LilySemantics.spoken(label, labels[part]) ?? ""))
                            .accessibilityHint(Text(verbatim: LilySemantics.spoken(error, description) ?? ""))
                    }
                }
            }
        }
        .accessibilityElement(children: .contain)
        .accessibilityLabel(Text(verbatim: label))
        .onAppear {
            parts = splitDateValue(value, precision)
            LilySemantics.warn(Self.warnings(precision: precision, labels: labels))
        }
        .onChange(of: value) { _, next in
            // A value set from outside fills the parts; one the parts produced leaves them as typed.
            if next != joinDateParts(parts, precision) { parts = splitDateValue(next, precision) }
        }
        .onChange(of: error, LilySemantics.errorChanged)
    }

    private func binding(_ part: DateFieldPart) -> Binding<String> {
        Binding(
            get: { parts[part] },
            set: { text in
                parts[part] = String(text.prefix(part == .year ? 4 : 2))
                value = joinDateParts(parts, precision)
            })
    }
}

extension View {
    /// The number keypad on iOS, where it exists; macOS has a keyboard. Decimal adds the point a magnitude may need.
    @ViewBuilder func lilyNumberKeyboard(decimal: Bool) -> some View {
        #if os(iOS)
            keyboardType(decimal ? .decimalPad : .numberPad)
        #else
            self
        #endif
    }
}
