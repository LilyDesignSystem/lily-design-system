import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<div
  class="carousel"
  role="region"
  aria-roledescription="carousel"
  aria-label="Carousel"
  data-module="carousel">
  <div class="carousel-slides"></div>
</div>`;

const meta = {
    title: "Headless/Carousel",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
