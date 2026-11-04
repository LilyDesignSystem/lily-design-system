<script setup lang="ts">
// WarningText component
//
// A short warning: an optional decorative icon and one bold line of text (the GOV.UK and DHCW
// warning-text pattern). The icon is the consumer's (Lily bundles none) and is hidden from
// assistive technology. The visually hidden prefix, such as "Warning", is part of the
// consumer's default slot, in the consumer's language; there is no prop or default for it.
//
// Slots:
//   default — the hidden prefix, then the warning text.
//   icon    — optional decorative icon, rendered inside an aria-hidden span.
//
// Syntax:
//   <WarningText>
//     <template #icon>!</template>
//     <span class="screen-reader-span">Warning</span> You can be fined if you do not register.
//   </WarningText>
//
// Attributes (class, id, data-*) fall through onto the root <div>.

import { useSlots } from "vue";

const slots = useSlots();
</script>

<template>
    <!-- WarningText.vue -->
    <div class="warning-text">
        <span v-if="slots.icon" class="warning-text-icon" aria-hidden="true"><slot name="icon" /></span>
        <strong class="warning-text-text"><slot /></strong>
    </div>
</template>
