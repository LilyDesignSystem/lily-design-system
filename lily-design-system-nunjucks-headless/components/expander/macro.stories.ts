import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<div
  class="expander" id="more">
  <button class="expander-button" type="button" aria-expanded="false" aria-controls="more-content">More about fees</button>
  <div class="expander-content" id="more-content" role="region" aria-label="More about fees" hidden><p>Fees are waived for under-18s.</p></div>
</div>`;

const meta = {
    title: "Headless/Expander",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
