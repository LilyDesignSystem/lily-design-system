import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<input id="character-counter-field-1" type="text" aria-label="">\n<span class="character-counter" x-data="lilyCharacterCounter(20, \'character-counter-field-1\')" x-bind="counter"><span class="character-counter-text" x-bind="counterShown"></span><span class="character-counter-status screen-reader-span" aria-label="" x-bind="counterStatus"></span></span>';

const meta = {
    title: "Headless/Character Counter",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
