import type { JSX } from "@solidjs/web";
import { createMemo, createSignal, For, Show } from "solid-js";
import { CATEGORY_LABEL, components } from "../data/components";
import { STANDALONE_ID, SUFFIX_LABEL, suffixPatternOf } from "../data/suffix-pattern";

// Category and suffix-pattern filters beside the text search. A category comes from each component's registry entry
// (bin/generate-component-categories, from the canonical HTML tag); the suffix pattern is derived from the slug. Both
// dropdowns list only ids present in the catalog, so there is no choice that always returns nothing.
interface FilterOption {
    id: string;
    label: string;
    count: number;
}

function countBy(items: Record<string, string>[], key: string): Map<string, number> {
    const counts = new Map<string, number>();
    for (const item of items) counts.set(item[key], (counts.get(item[key]) ?? 0) + 1);
    return counts;
}

const withSuffix = components.map((c) => ({ ...c, suffix: suffixPatternOf(c.slug) }));
const categoryCounts = countBy(withSuffix, "category");
const suffixCounts = countBy(withSuffix, "suffix");
const categoryOptions: FilterOption[] = Object.entries(CATEGORY_LABEL)
    .filter(([id]) => categoryCounts.has(id))
    .map(([id, label]) => ({ id, label, count: categoryCounts.get(id) ?? 0 }))
    .sort((a, b) => b.count - a.count);
const suffixOptions: FilterOption[] = Object.entries(SUFFIX_LABEL)
    .filter(([id]) => suffixCounts.has(id) && id !== STANDALONE_ID)
    .map(([id, label]) => ({ id, label, count: suffixCounts.get(id) ?? 0 }))
    .sort((a, b) => b.count - a.count)
    .concat(
        suffixCounts.has(STANDALONE_ID)
            ? [
                  {
                      id: STANDALONE_ID,
                      label: SUFFIX_LABEL[STANDALONE_ID],
                      count: suffixCounts.get(STANDALONE_ID) ?? 0,
                  },
              ]
            : [],
    );

export default function Components(): JSX.Element {
    const [search, setSearch] = createSignal("");
    const [categoryFilter, setCategoryFilter] = createSignal("");
    const [suffixFilter, setSuffixFilter] = createSignal("");

    const filtered = createMemo(() => {
        const q = search().toLowerCase();
        return withSuffix.filter((c) => {
            const matchesSearch =
                q === "" ||
                c.name.toLowerCase().includes(q) ||
                c.slug.includes(q) ||
                c.description.toLowerCase().includes(q);
            const matchesCategory = categoryFilter() === "" || c.category === categoryFilter();
            const matchesSuffix = suffixFilter() === "" || c.suffix === suffixFilter();
            return matchesSearch && matchesCategory && matchesSuffix;
        });
    });

    function resetFilters(): void {
        setSearch("");
        setCategoryFilter("");
        setSuffixFilter("");
    }

    const hasActiveFilters = () =>
        search() !== "" || categoryFilter() !== "" || suffixFilter() !== "";

    return (
        <main class="page-wrapper">
            <h1>Components</h1>
            <p>{components.length} headless components</p>

            <div class="field">
                <label
                    class="label"
                    for="search"
                >
                    Filter components
                </label>
                <input
                    id="search"
                    type="search"
                    class="search-input"
                    placeholder="Search components..."
                    value={search()}
                    defaultValue={search()}
                    onInput={(e) => setSearch(e.currentTarget.value)}
                />
            </div>

            <div class="field">
                <label
                    class="label"
                    for="category-filter"
                >
                    Category
                </label>
                <select
                    id="category-filter"
                    class="select"
                    value={categoryFilter()}
                    onChange={(e) => setCategoryFilter(e.currentTarget.value)}
                >
                    <option value="">All categories ({components.length})</option>
                    <For each={categoryOptions}>
                        {(opt) => (
                            <option value={opt.id}>
                                {opt.label} ({opt.count})
                            </option>
                        )}
                    </For>
                </select>
            </div>

            <div class="field">
                <label
                    class="label"
                    for="suffix-filter"
                >
                    Suffix pattern
                </label>
                <select
                    id="suffix-filter"
                    class="select"
                    value={suffixFilter()}
                    onChange={(e) => setSuffixFilter(e.currentTarget.value)}
                >
                    <option value="">All suffix patterns ({components.length})</option>
                    <For each={suffixOptions}>
                        {(opt) => (
                            <option value={opt.id}>
                                {opt.label} ({opt.count})
                            </option>
                        )}
                    </For>
                </select>
            </div>

            <Show when={hasActiveFilters()}>
                <p>
                    <button
                        type="button"
                        class="button"
                        onClick={resetFilters}
                    >
                        Clear filters
                    </button>
                </p>
            </Show>

            <p role="status">
                {filtered().length} of {components.length} components
            </p>

            <ul class="component-index">
                <For each={filtered()}>
                    {(c) => (
                        <li>
                            <a href={`/components/${c.slug}`}>{c.name}</a>{" "}
                            <span class="component-index-description">{c.description}</span>
                        </li>
                    )}
                </For>
            </ul>
        </main>
    );
}
