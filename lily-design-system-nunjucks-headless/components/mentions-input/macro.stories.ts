import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="mentions-input"
  data-trigger-char="@">
  <input
    class="mentions-input-control"
    type="text"
    role="combobox"
    aria-haspopup="listbox"
    aria-autocomplete="list"
    aria-expanded="false"    value=""  >
  <div
    class="mentions-input-suggestions" hidden  ></div>
</div>`;

const meta = {
  title: 'Headless/MentionsInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
