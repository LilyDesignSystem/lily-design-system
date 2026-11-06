import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<div\n  class="scroller"\n  role="group"\n  aria-label=""\n  data-offset="0.5"\n>\n  <div\n    class="scroller-background"\n    aria-live="polite"\n  >\n    <!-- Consumer provides sticky background -->\n  </div>\n  <div\n    class="scroller-foreground scroller-base"\n    data-offset="0.5"\n  >\n    <!-- Consumer provides step children -->\n  </div>\n</div>';

const meta = {
    title: "Headless/Scroller",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
