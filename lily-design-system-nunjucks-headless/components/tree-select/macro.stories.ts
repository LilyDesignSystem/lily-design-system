import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="tree-select"
  role="combobox"
  aria-haspopup="tree"
  aria-expanded="false">
  <button
    class="tree-select-trigger"
    type="button"  ></button>
  <div
    class="tree-select-panel" hidden  ></div>
</div>`;

const meta = {
  title: 'Headless/TreeSelect',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
