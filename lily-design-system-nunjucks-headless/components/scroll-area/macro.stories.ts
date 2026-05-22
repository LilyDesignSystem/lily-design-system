import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="scroll-area"  tabindex="0"></div>`;

const meta = {
  title: 'Headless/ScrollArea',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
