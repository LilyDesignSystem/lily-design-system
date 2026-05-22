import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="cascader"
  role="combobox"
  aria-haspopup="tree"
  aria-expanded="false">
  <button
    class="cascader-trigger"
    type="button"  ></button>
  <div
    class="cascader-panel" hidden  ></div>
</div>`;

const meta = {
  title: 'Headless/Cascader',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
