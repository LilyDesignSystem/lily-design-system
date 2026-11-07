import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<div\n  class="error-summary"\n  role="alert"\n  tabindex="-1"\n  aria-labelledby="error-summary-title"\n>\n  <h2 id="error-summary-title"><!-- Consumer provides the title --></h2>\n  <!-- Consumer provides the error list -->\n</div>';

const meta = {
    title: "Headless/Error Summary",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
