import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="container"
></div>`;

const meta = {
  title: 'Headless/Container',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
