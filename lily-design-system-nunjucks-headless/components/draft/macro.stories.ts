import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="draft"
></div>`;

const meta = {
  title: 'Headless/Draft',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
