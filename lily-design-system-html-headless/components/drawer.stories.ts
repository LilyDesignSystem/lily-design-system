import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<!-- Shown with the open attribute so the story is visible; the component opens it with showModal() -->
<dialog
  class="drawer"
  open
  aria-modal="true"
  aria-label=""
  data-open="false"
>
  <!-- Consumer provides content -->
</dialog>

<script>
  // Drawer behavior
  (function() {
    'use strict';
    // Drawer: consumer implements interactive behavior
    document.querySelectorAll('.drawer').forEach(function(el) {
      // Interactive behavior initialization
    });
  })();
</script>`;

const meta = {
    title: "Headless/Drawer",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
