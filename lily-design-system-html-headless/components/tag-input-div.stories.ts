import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<div
  class="tag-input-div"
  aria-label=""
>
  <!-- Consumer provides content -->
</div>

<script>
  // TagInputDiv behavior
  (function() {
    'use strict';
    // TagInputDiv: consumer implements interactive behavior
    document.querySelectorAll('.tag-input-div').forEach(function(el) {
      // Interactive behavior initialization
    });
  })();
</script>`;

const meta = {
    title: "Headless/TagInputDiv",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
