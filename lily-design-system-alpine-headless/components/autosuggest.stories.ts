import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<div class="autosuggest" x-data="lilyAutosuggest()">\n  <input class="autosuggest-input" type="text" aria-label="" aria-controls="autosuggest-list-1" x-bind="input">\n  <ul class="autosuggest-list" id="autosuggest-list-1" aria-label="" x-ref="list" x-bind="listbox">\n    <!-- On lily:input, render the suggestions here as <li class="autosuggest-option" role="option" data-value="…">…</li> -->\n  </ul>\n</div>';

const meta = {
    title: "Headless/Autosuggest",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
