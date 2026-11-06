import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<dl><div class="summary-list-item">
  <dt>Term</dt>
  <dd><!-- Consumer provides the value --></dd>
</div></dl>`;

const meta = {
    title: "Headless/SummaryListItem",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
