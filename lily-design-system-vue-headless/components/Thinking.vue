<script setup lang="ts">

    // Thinking component
    //
    // A native <details> disclosure for an AI "reasoning" block. Closed by default.
    //
    // Props:
    //   label -- string, required. Summary text.
    //   open -- boolean, default false. Bindable via v-model:open.
    //   streaming -- boolean, default false. Sets data-streaming and aria-busy.
    //   default slot -- reasoning content, rendered in .thinking-content.
    //   ...attrs -- fall through onto the root <details>.
    //
    // Keyboard: native <summary> (Enter / Space).
    //
    // Vue note: <details> has no two-way open binding, so the native "toggle"
    // event is mirrored into the model (the Svelte canonical uses bind:open).

    defineProps<{
        /** Summary text. */
        label: string;
        /** Whether content is still being produced. */
        streaming?: boolean;
    }>();

    const open = defineModel<boolean>("open", { default: false });

    function ontoggle(event: Event) {
        open.value = (event.target as HTMLDetailsElement).open;
    }

</script>

<template>
    <!-- Thinking.vue -->
    <details
        class="thinking"
        :open="open"
        :data-streaming="streaming ? 'true' : undefined"
        :aria-busy="streaming ? 'true' : undefined"
        @toggle="ontoggle"
    >
        <summary class="thinking-summary">{{ label }}</summary>
        <div class="thinking-content">
            <slot />
        </div>
    </details>
</template>
