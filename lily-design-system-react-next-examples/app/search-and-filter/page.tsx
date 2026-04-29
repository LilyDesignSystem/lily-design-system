"use client";

import { useState } from "react";
import Combobox from "@pgds/Combobox";
import SearchInput from "@pgds/SearchInput";
import TagGroup from "@pgds/TagGroup";
import Tag from "@pgds/Tag";
import TagInput from "@pgds/TagInput";
import DataTable from "@pgds/DataTable";
import DataTableHead from "@pgds/DataTableHead";
import DataTableBody from "@pgds/DataTableBody";
import DataTableRow from "@pgds/DataTableRow";
import DataTableTD from "@pgds/DataTableTD";
import Badge from "@pgds/Badge";

interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    status: "in-stock" | "low-stock" | "out-of-stock";
}

const products: Product[] = [
    { id: 1, name: "Wireless Keyboard", category: "Electronics", price: 59.99, status: "in-stock" },
    { id: 2, name: "Ergonomic Mouse", category: "Electronics", price: 34.99, status: "in-stock" },
    { id: 3, name: "Standing Desk", category: "Furniture", price: 499.00, status: "low-stock" },
    { id: 4, name: "Monitor Arm", category: "Furniture", price: 89.99, status: "in-stock" },
    { id: 5, name: "USB-C Hub", category: "Electronics", price: 44.99, status: "out-of-stock" },
    { id: 6, name: "Desk Lamp", category: "Lighting", price: 29.99, status: "in-stock" },
    { id: 7, name: "Webcam HD", category: "Electronics", price: 74.99, status: "low-stock" },
    { id: 8, name: "Cable Organizer", category: "Accessories", price: 12.99, status: "in-stock" },
];

const categories = [...new Set(products.map((p) => p.category))];

function statusBadgeType(s: string): "success" | "warning" | "error" {
    if (s === "in-stock") return "success";
    if (s === "low-stock") return "warning";
    return "error";
}

export default function SearchAndFilterPage() {
    const [query, setQuery] = useState("");
    const [comboValue, setComboValue] = useState("");
    const [comboOpen, setComboOpen] = useState(false);
    const [filterTags, setFilterTags] = useState<string[]>([]);
    const [tagValue, setTagValue] = useState("");

    const comboSuggestions = categories.filter(
        (c) => c.toLowerCase().includes(comboValue.toLowerCase()) && !filterTags.includes(c)
    );

    const filtered = products.filter((p) => {
        const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase());
        const matchesTags = filterTags.length === 0 || filterTags.includes(p.category);
        return matchesQuery && matchesTags;
    });

    function addTag(tag: string) {
        if (tag && !filterTags.includes(tag)) {
            setFilterTags([...filterTags, tag]);
        }
    }

    function removeTag(tag: string) {
        setFilterTags(filterTags.filter((t) => t !== tag));
    }

    return (
        <main>
            <h1>Product Search</h1>

            <SearchInput
                label="Search products"
                value={query}
                onChange={setQuery}
                placeholder="Search by name..."
            />

            <h2>Filter by Category</h2>
            <Combobox
                label="Select category"
                value={comboValue}
                onChange={(v) => { setComboValue(v); setComboOpen(v.length > 0); }}
                open={comboOpen}
                onOpenChange={setComboOpen}
            >
                {comboSuggestions.map((cat) => (
                    <div key={cat} role="option" tabIndex={-1} onClick={() => {
                        addTag(cat); setComboValue(""); setComboOpen(false);
                    }}>{cat}</div>
                ))}
            </Combobox>

            <TagInput
                label="Add custom filter tag"
                value={tagValue}
                onChange={setTagValue}
                onAdd={addTag}
                placeholder="Type and press Enter..."
            />

            <TagGroup label="Active filters">
                {filterTags.map((tag) => (
                    <Tag key={tag} label={`Filter: ${tag}`}>
                        {tag} <button onClick={() => removeTag(tag)} aria-label={`Remove ${tag}`}>x</button>
                    </Tag>
                ))}
            </TagGroup>

            <h2>Results ({filtered.length})</h2>
            <DataTable label="Product catalog" caption={`${filtered.length} products found`}>
                <DataTableHead>
                    <DataTableRow>
                        <th scope="col">Name</th>
                        <th scope="col">Category</th>
                        <th scope="col">Price</th>
                        <th scope="col">Status</th>
                    </DataTableRow>
                </DataTableHead>
                <DataTableBody>
                    {filtered.map((p) => (
                        <DataTableRow key={p.id}>
                            <DataTableTD>{p.name}</DataTableTD>
                            <DataTableTD>{p.category}</DataTableTD>
                            <DataTableTD>${p.price.toFixed(2)}</DataTableTD>
                            <DataTableTD>
                                <Badge type={statusBadgeType(p.status)}>{p.status}</Badge>
                            </DataTableTD>
                        </DataTableRow>
                    ))}
                </DataTableBody>
            </DataTable>
        </main>
    );
}
