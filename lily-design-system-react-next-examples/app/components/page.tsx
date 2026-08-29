"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { components, CATEGORY_LABEL } from "@/app/data/components";
import { suffixPatternOf, SUFFIX_LABEL, STANDALONE_ID } from "@/app/data/suffix-pattern";

// Plan P6-T5: category + suffix-pattern filters alongside the
// existing text search. Category comes from each component's own
// registry entry (bin/generate-component-categories, sourced from
// the canonical HTML tag in components/{slug}/AGENTS.md); suffix
// pattern is derived client-side from the slug (app/data/suffix-pattern.ts).
// Both dropdowns only ever list ids actually present in the catalog,
// so "All ..." plus real, populated options -- no dead choices that
// would always return zero results.

interface FilterOption {
    id: string;
    label: string;
    count: number;
}

function countBy(items: Record<string, string>[], key: string): Map<string, number> {
    const counts = new Map<string, number>();
    for (const item of items) {
        const id = item[key];
        counts.set(id, (counts.get(id) ?? 0) + 1);
    }
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
            ? [{ id: STANDALONE_ID, label: SUFFIX_LABEL[STANDALONE_ID], count: suffixCounts.get(STANDALONE_ID) ?? 0 }]
            : []
    );

export default function ComponentsPage() {
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [suffixFilter, setSuffixFilter] = useState("");

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return withSuffix.filter((c) => {
            const matchesSearch =
                q === "" ||
                c.name.toLowerCase().includes(q) ||
                c.slug.includes(q) ||
                c.description.toLowerCase().includes(q);
            const matchesCategory = categoryFilter === "" || c.category === categoryFilter;
            const matchesSuffix = suffixFilter === "" || c.suffix === suffixFilter;
            return matchesSearch && matchesCategory && matchesSuffix;
        });
    }, [search, categoryFilter, suffixFilter]);

    function resetFilters() {
        setSearch("");
        setCategoryFilter("");
        setSuffixFilter("");
    }

    const hasActiveFilters = search !== "" || categoryFilter !== "" || suffixFilter !== "";

    return (
        <main className="page-wrapper">
            <h1>Components</h1>
            <p>{components.length} headless components</p>

            <div className="field">
                <label className="label" htmlFor="search">Filter components</label>
                <input
                    id="search"
                    type="search"
                    className="search-input"
                    placeholder="Search components..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="field">
                <label className="label" htmlFor="category-filter">Category</label>
                <select
                    id="category-filter"
                    className="select"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                >
                    <option value="">All categories ({components.length})</option>
                    {categoryOptions.map((opt) => (
                        <option key={opt.id} value={opt.id}>{opt.label} ({opt.count})</option>
                    ))}
                </select>
            </div>

            <div className="field">
                <label className="label" htmlFor="suffix-filter">Suffix pattern</label>
                <select
                    id="suffix-filter"
                    className="select"
                    value={suffixFilter}
                    onChange={(e) => setSuffixFilter(e.target.value)}
                >
                    <option value="">All suffix patterns ({components.length})</option>
                    {suffixOptions.map((opt) => (
                        <option key={opt.id} value={opt.id}>{opt.label} ({opt.count})</option>
                    ))}
                </select>
            </div>

            {hasActiveFilters && (
                <p>
                    <button type="button" className="button" onClick={resetFilters}>Clear filters</button>
                </p>
            )}

            <p role="status">{filtered.length} of {components.length} components</p>

            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {filtered.map((c) => (
                    <li key={c.slug} style={{ borderBottom: "1px solid var(--nhs-color-border, #d8dde0)", padding: "var(--nhs-space-3) 0" }}>
                        <Link href={`/components/${c.slug}`} style={{ fontWeight: 700 }}>{c.name}</Link>
                        <span style={{ color: "var(--nhs-color-secondary, #4c6272)", marginLeft: "0.5rem" }}>{c.description}</span>
                    </li>
                ))}
            </ul>
        </main>
    );
}
