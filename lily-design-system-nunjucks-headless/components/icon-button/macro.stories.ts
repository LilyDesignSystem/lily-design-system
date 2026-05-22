import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<button
  class="icon-button"
  type="button"></button>`;

const meta = {
  title: 'Headless/IconButton',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
