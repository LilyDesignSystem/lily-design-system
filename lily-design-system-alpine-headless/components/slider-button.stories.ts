import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<button class="slider-button" aria-label="" x-data="lilySliderButton(10)" x-bind="button">\n  <!-- Consumer provides the track and thumb; it hears lily:confirm -->\n</button>';

const meta = {
    title: "Headless/Slider Button",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
