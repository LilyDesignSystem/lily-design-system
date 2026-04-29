<script setup lang="ts">
import { ref, computed } from "vue";

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

const query = ref("");
const comboValue = ref("");
const comboOpen = ref(false);
const filterTags = ref<string[]>([]);
const tagValue = ref("");

function statusBadgeType(s: string): string {
    if (s === "in-stock") return "success";
    if (s === "low-stock") return "warning";
    return "error";
}

const comboSuggestions = computed(() =>
    categories.filter(
        (c) => c.toLowerCase().includes(comboValue.value.toLowerCase()) && !filterTags.value.includes(c)
    )
);

const filtered = computed(() =>
    products.filter((p) => {
        const matchesQuery = p.name.toLowerCase().includes(query.value.toLowerCase());
        const matchesTags = filterTags.value.length === 0 || filterTags.value.includes(p.category);
        return matchesQuery && matchesTags;
    })
);

function addTag(tag: string) {
    if (tag && !filterTags.value.includes(tag)) {
        filterTags.value.push(tag);
    }
}

function removeTag(tag: string) {
    filterTags.value = filterTags.value.filter((t) => t !== tag);
}
</script>

<template>
    <main class="page-wrapper">
        <h1>Product Search</h1>

        <SearchInput label="Search products" v-model="query" placeholder="Search by name..." />

        <h2>Filter by Category</h2>
        <Combobox
            label="Select category"
            v-model="comboValue"
            :open="comboOpen"
        >
            <div
                v-for="cat in comboSuggestions"
                :key="cat"
                role="option"
                :tabindex="-1"
                @click="addTag(cat); comboValue = ''; comboOpen = false"
            >
                {{ cat }}
            </div>
        </Combobox>

        <TagInput
            label="Add custom filter tag"
            v-model="tagValue"
            placeholder="Type and press Enter..."
        />

        <TagGroup label="Active filters">
            <Tag v-for="tag in filterTags" :key="tag" :label="`Filter: ${tag}`">
                {{ tag }}
                <button @click="removeTag(tag)" :aria-label="`Remove ${tag}`">x</button>
            </Tag>
        </TagGroup>

        <h2>Results ({{ filtered.length }})</h2>
        <DataTable label="Product catalog">
            <DataTableHead>
                <DataTableRow>
                    <th scope="col">Name</th>
                    <th scope="col">Category</th>
                    <th scope="col">Price</th>
                    <th scope="col">Status</th>
                </DataTableRow>
            </DataTableHead>
            <DataTableBody>
                <DataTableRow v-for="p in filtered" :key="p.id">
                    <DataTableTD>{{ p.name }}</DataTableTD>
                    <DataTableTD>{{ p.category }}</DataTableTD>
                    <DataTableTD>${{ p.price.toFixed(2) }}</DataTableTD>
                    <DataTableTD>
                        <Badge :type="statusBadgeType(p.status)">{{ p.status }}</Badge>
                    </DataTableTD>
                </DataTableRow>
            </DataTableBody>
        </DataTable>
    </main>
</template>
