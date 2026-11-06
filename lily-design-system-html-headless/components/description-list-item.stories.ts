import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<div
  class="description-list-item"
>
  <!-- Consumer provides content -->
</div>`;

const meta = {
    title: "Headless/DescriptionListItem",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
