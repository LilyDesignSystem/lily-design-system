<!--
  Test-only host: exercises the `card`, `columnHeader` and `columnFooter` snippets with real
  Svelte template syntax. Used only by KanbanBoard.test.ts §8.48–§8.55.
-->
<script lang="ts">
    import KanbanBoard from "./KanbanBoard.svelte";
    import type { KanbanCard, KanbanColumn, KanbanLabels } from "./KanbanBoard.svelte";

    let {
        columns,
        cards,
        labels,
        withCard = false,
        withHeader = false,
        withFooter = false,
    }: {
        columns: KanbanColumn[];
        cards: KanbanCard[];
        labels?: KanbanLabels;
        withCard?: boolean;
        withHeader?: boolean;
        withFooter?: boolean;
    } = $props();
</script>

{#if withCard && withFooter}
    <KanbanBoard label="Board" {columns} {cards} {labels}>
        {#snippet card({ card, label, pending })}
            <b data-custom-card={card.id} data-pending-flag={pending ? "yes" : "no"}>{label}!</b>
        {/snippet}
        {#snippet columnFooter({ column, count })}
            <i data-footer={column.id}>{count}</i>
        {/snippet}
    </KanbanBoard>
{:else if withCard}
    <KanbanBoard label="Board" {columns} {cards} {labels}>
        {#snippet card({ card, label })}
            <b data-custom-card={card.id}>{label}!</b>
        {/snippet}
    </KanbanBoard>
{:else if withHeader}
    <KanbanBoard label="Board" {columns} {cards} {labels}>
        {#snippet columnHeader({ column, count })}
            <i data-header={column.id}>{count}</i>
        {/snippet}
    </KanbanBoard>
{:else if withFooter}
    <KanbanBoard label="Board" {columns} {cards} {labels}>
        {#snippet columnFooter({ column, cards, count })}
            <i data-footer={column.id}>{count}:{cards.map((c) => c.id).join(",")}</i>
        {/snippet}
    </KanbanBoard>
{/if}
