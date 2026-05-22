import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="split-button"
  role="group">
  <button
    class="split-button-primary"
    type="button"  ></button>
  <button
    class="split-button-menu-trigger"
    type="button"
    aria-haspopup="menu"
    aria-expanded="false"  ></button>
  <div
    class="split-button-menu" hidden  ></div>
</div>`;

const meta = {
  title: 'Headless/SplitButton',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
