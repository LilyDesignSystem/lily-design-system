import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="tool-bar"
  role="toolbar"
  aria-orientation="horizontal" aria-label="Tool bar"></div>`;

const meta = {
  title: 'Headless/ToolBar',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
