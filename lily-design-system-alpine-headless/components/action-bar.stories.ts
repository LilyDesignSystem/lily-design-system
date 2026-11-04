import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<div\n  class="action-bar"\n  role="toolbar"\n  aria-label=""\n  data-selected-count="0"\n  x-lily-toolbar=".action-bar-clear"\n>\n  <span class="action-bar-count"></span>\n  <!-- Consumer inserts action-bar-button children here -->\n  <button\n    class="action-bar-clear"\n    type="button"\n    aria-label=""\n  >\n    ×\n  </button>\n</div>';

const meta = {
    title: "Headless/Action Bar",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
