// RepeatableFieldset (components/repeatable-fieldset): the "add another" pattern, a question answered with a list of the same
// fields, such as each medicine a person takes. Each item is a labelled group with its remove button; the add button follows the
// list. Adding or removing is announced in the consumer's words, when given (tasks.md P62-T3, shared/form-parts.ts).

import LilyCore
import SwiftUI

public struct RepeatableFieldset<Item, ItemContent: View>: View {
    private let legend: String
    @Binding private var items: [Item]
    private let newItem: () -> Item
    private let itemLegend: (Int) -> String
    private let addLabel: String
    private let removeLabel: (Int) -> String
    private let min: Int
    private let max: Int?
    private let addedLabel: ((Int) -> String)?
    private let removedLabel: ((Int) -> String)?
    private let item: (Binding<Item>, Int) -> ItemContent

    /// - Parameters:
    ///   - legend: names the whole list ("Your medicines").
    ///   - items: the consumer's items.
    ///   - newItem: makes an item when the add button is pressed.
    ///   - itemLegend: each item's name, from 1 ("Medicine 2").
    ///   - addLabel: the add button's words ("Add a medicine").
    ///   - removeLabel: each remove button's words, from 1 ("Remove medicine 2").
    ///   - min, max: the fewest and most items; the remove buttons go at the minimum, the add button is dimmed at the maximum.
    ///   - addedLabel, removedLabel: what VoiceOver announces after an add or a remove, from 1.
    ///   - item: one item's fields, given its binding and its index from 0.
    public init(
        legend: String, items: Binding<[Item]>, newItem: @escaping () -> Item, itemLegend: @escaping (Int) -> String,
        addLabel: String, removeLabel: @escaping (Int) -> String, min: Int = 0, max: Int? = nil,
        addedLabel: ((Int) -> String)? = nil, removedLabel: ((Int) -> String)? = nil,
        @ViewBuilder item: @escaping (Binding<Item>, Int) -> ItemContent
    ) {
        self.legend = legend
        self._items = items
        self.newItem = newItem
        self.itemLegend = itemLegend
        self.addLabel = addLabel
        self.removeLabel = removeLabel
        self.min = min
        self.max = max
        self.addedLabel = addedLabel
        self.removedLabel = removedLabel
        self.item = item
    }

    /// Whether another item may be added and one removed, by the shared rules; limits out of range are a warning and a no.
    public static func allowed(count: Int, min: Int, max: Int?) -> (add: Bool, remove: Bool) {
        do throws(FormPartsError) {
            return (try canAddItem(count: count, max: max), try canRemoveItem(count: count, min: min))
        } catch {
            LilySemantics.warn(["RepeatableFieldset: \(error.reason) is not a whole number"])
            return (false, false)
        }
    }

    public var body: some View {
        let allowed = Self.allowed(count: items.count, min: min, max: max)
        VStack(alignment: .leading, spacing: 12) {
            Text(verbatim: legend).bold().accessibilityAddTraits(.isHeader)
            ForEach(items.indices, id: \.self) { index in
                VStack(alignment: .leading, spacing: 8) {
                    Text(verbatim: itemLegend(index + 1)).accessibilityAddTraits(.isHeader)
                    item($items[index], index)
                    if allowed.remove {
                        Button(removeLabel(index + 1)) { remove(index) }
                    }
                }
                .accessibilityElement(children: .contain)
                .accessibilityLabel(Text(verbatim: itemLegend(index + 1)))
            }
            Button(addLabel) { add() }.disabled(!allowed.add)
        }
        .accessibilityElement(children: .contain)
        .accessibilityLabel(Text(verbatim: legend))
    }

    private func add() {
        items.append(newItem())
        if let addedLabel { LilySemantics.announce(AttributedString(addedLabel(items.count))) }
    }

    private func remove(_ index: Int) {
        items.remove(at: index)
        if let removedLabel { LilySemantics.announce(AttributedString(removedLabel(index + 1))) }
    }
}
