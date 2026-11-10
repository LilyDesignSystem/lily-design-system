import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<div
  class="select-with-extras"
  data-module="select-with-extras">  <select id="country" aria-label="Country"  ><option value="fr">France</option></select></div>`;

const meta = {
    title: "Headless/SelectWithExtras",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
