import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="combobox"
  data-module="combobox">
  <input
    class="combobox-input"
    type="text"
    role="combobox"
    id="combobox-input"    value=""
    aria-expanded="false"
    aria-controls="combobox-listbox"
    aria-autocomplete="list"  >
  <ul class="combobox-listbox" role="listbox" id="combobox-listbox" hidden></ul>
</div>`;

const meta = {
  title: 'Headless/Combobox',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
