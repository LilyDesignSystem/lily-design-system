import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<fieldset class="range-fieldset" x-data>\n  <legend class="range-fieldset-legend"></legend>\n  <input class="range-fieldset-minimum" type="range" aria-label="" min="0" max="100" step="1" value="20" x-ref="minimum" @input="if (+$el.value > +$refs.maximum.value) $el.value = $refs.maximum.value">\n  <input class="range-fieldset-maximum" type="range" aria-label="" min="0" max="100" step="1" value="80" x-ref="maximum" @input="if (+$el.value < +$refs.minimum.value) $el.value = $refs.minimum.value">\n</fieldset>';

const meta = {
    title: "Headless/Range Fieldset",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
