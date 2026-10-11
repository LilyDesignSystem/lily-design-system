<script setup lang="ts">

    // ChatComposer component
    //
    // A headless chat input form: a <textarea> that grows with its content (rows from the number of lines, clamped between minRows and maxRows) and ONE button that is "send" normally and turns into "stop" while `busy`. Enter sends; Shift+Enter inserts a line break; Enter while an IME composition is in progress does nothing. The send button is disabled, never hidden, when the text is empty or the form is disabled. The component never clears the text (the consumer does, in its send handler), never animates, and carries no strings: the textarea name, the send word and the stop word are required props. Models, attachments and menus are consumer composition (put them in the default slot, rendered before the textarea).
    //
    // Props: label, sendLabel, stopLabel (required strings), placeholder, name, minRows (1), maxRows (8),
    // busy, disabled. v-model: the text. Emits: send(value), stop. Default slot: before the textarea.
    // Keyboard: Enter sends; Shift+Enter inserts a line break; Enter during IME composition is ignored.

    import { computed } from "vue";

    const props = withDefaults(defineProps<{
        /** Accessible name of the textarea. */
        label: string;
        /** Word for the send button. */
        sendLabel: string;
        /** Word for the stop button. */
        stopLabel: string;
        placeholder?: string;
        name?: string;
        minRows?: number;
        maxRows?: number;
        /** A reply is in progress. */
        busy?: boolean;
        disabled?: boolean;
    }>(), {
        placeholder: undefined,
        name: undefined,
        minRows: 1,
        maxRows: 8,
        busy: false,
        disabled: false,
    });

    const emit = defineEmits<{ send: [value: string]; stop: [] }>();
    const value = defineModel<string>({ default: "" });

    const empty = computed(() => value.value.trim() === "");
    const rows = computed(() => Math.min(props.maxRows, Math.max(props.minRows, value.value.split("\n").length)));

    function trySend(): void {
        if (props.disabled || props.busy || empty.value) return;
        emit("send", value.value);
    }

    function onKeydown(event: KeyboardEvent): void {
        if (event.key !== "Enter") return;
        if (event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) return;
        // IME: Enter that confirms a composition must not send.
        if (event.isComposing || event.keyCode === 229) return;
        event.preventDefault();
        trySend();
    }

</script>

<template>
    <!-- ChatComposer.vue -->
    <form class="chat-composer" @submit.prevent="trySend">
        <slot />
        <textarea
            class="chat-composer-input"
            :aria-label="label"
            v-model="value"
            :rows="rows"
            :placeholder="placeholder"
            :name="name"
            :disabled="disabled"
            @keydown="onKeydown"
        ></textarea>
        <button
            class="chat-composer-button"
            :type="busy ? 'button' : 'submit'"
            :data-state="busy ? 'stop' : 'send'"
            :disabled="disabled || (!busy && empty)"
            @click="busy ? emit('stop') : undefined"
        >
            <span class="chat-composer-button-label">{{ busy ? stopLabel : sendLabel }}</span>
        </button>
    </form>
</template>
