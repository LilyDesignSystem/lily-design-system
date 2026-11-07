<script setup lang="ts">
// EmojiCharacterPicker component
//
// A group of selectable emoji characters for browsing and selecting emoji.
// Renders a <div> with role="group" and an accessible label. Commonly used
// in messaging apps, social media, comment systems, and rich text editors.
// The consumer provides the emoji buttons, selection logic, and category navigation.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name describing the picker.
//   default slot. The emoji buttons, one per character.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <EmojiCharacterPicker label="Choose an emoji">
//     <button type="button">😀</button>
//   </EmojiCharacterPicker>
//
// Examples:
//   <!-- Emoji picker with row of characters -->
//   <EmojiCharacterPicker label="Choose an emoji">
//     <button type="button">😀</button>
//     <button type="button">😂</button>
//     <button type="button">😍</button>
//   </EmojiCharacterPicker>
//
// Keyboard:
//   - Tab moves between the emoji buttons; Enter or Space chooses one (native buttons)
//
// Accessibility:
//   - role="group" groups the emoji buttons under the picker's name
//   - aria-label provides an accessible name for the picker
//   - Give an emoji button an aria-label where the character alone is not clear
//
// Internationalization:
//   - The label prop accepts any string; consumers provide localized text
//   - Emoji characters are locale-independent
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - No internal state — purely a structural wrapper
//   - Consumer implements selection behavior and category filtering
//
// References:
//   - WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group
defineProps<{
    label: string;
}>();
</script>

<template>
    <!-- EmojiCharacterPicker.vue -->
    <div
        class="emoji-character-picker"
        role="group"
        :aria-label="label"
    >
        <slot />
    </div>
</template>
