<script setup lang="ts">
// ToggleButton component
//
// A headless toggle button: a native <button> with aria-pressed, the WAI-ARIA
// toggle button pattern. Supports click and
// keyboard (Space key) interaction. The pressed state is bindable for
// two-way data flow. For actions that stay on, such as Bold, Mute or
// Favourite; for a setting that turns on or off, use SwitchButton (role="switch").
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name via aria-label.
//   pressed — boolean, default false. Whether the toggle is on. Bindable.
//   disabled — boolean, default false. Whether the toggle is disabled.
//   default slot. Button content.
//   ...restProps — additional HTML attributes spread onto the <button>.
//
// Syntax:
//   <ToggleButton label="Dark mode" v-model:pressed />
//
// Examples:
//   <!-- Dark mode toggle -->
//   <ToggleButton label="Dark mode" v-model:pressed />
//
//   <!-- Mute toggle with disabled state -->
//   <ToggleButton label="Mute audio" v-model:pressed={muted} disabled={locked} />
//
// Keyboard:
//   - Space: toggles between on and off states
//   - Enter: activates the button (native button behavior)
//
// Accessibility:
//   - A native <button>: no role is needed; a screen reader says "toggle button"
//   - aria-pressed={pressed} communicates the current state ("pressed" / "not pressed")
//   - aria-label={label} provides the accessible name
//
// Internationalization:
//   - The label prop accepts any translated string
//   - No hardcoded strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Uses defineModel() for two-way data binding on pressed
//   - type="button" prevents accidental form submission
//
// References:
//   - WAI-ARIA Button Pattern (toggle button): https://www.w3.org/WAI/ARIA/apg/patterns/button/
//   - aria-pressed: https://www.w3.org/TR/wai-aria-1.2/#aria-pressed

const props = withDefaults(
    defineProps<{
        /** Accessible label. */
        label: string;
        /** Whether the toggle is disabled. */
        disabled?: boolean;
    }>(),
    {
        disabled: false,
    },
);

const pressed = defineModel<boolean>("pressed", { default: false });

function onclick() {
    if (!props.disabled) {
        pressed.value = !pressed.value;
    }
}

function onkeydown(event: KeyboardEvent) {
    if (event.key === " ") {
        event.preventDefault();
        if (!props.disabled) {
            pressed.value = !pressed.value;
        }
    }
}
</script>

<template>
    <!-- ToggleButton.vue -->
    <button
        class="toggle-button"
        type="button"
        :aria-pressed="pressed"
        :aria-label="label"
        :disabled="disabled"
        @click="onclick"
        @keydown="onkeydown"
    >
        <slot />
    </button>
</template>
