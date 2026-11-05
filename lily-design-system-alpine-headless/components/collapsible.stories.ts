import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<details class="collapsible">\n  <summary class="collapsible-summary">\n    <!-- Consumer provides summary -->\n  </summary>\n  <div class="collapsible-body">\n    <!-- Consumer provides content -->\n  </div>\n</details>';

const meta = {
    title: "Headless/Collapsible",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
