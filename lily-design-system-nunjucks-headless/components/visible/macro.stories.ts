import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="visible"
  data-visible="false"></div>`;

const meta = {
  title: 'Headless/Visible',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
