import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<strong
  class="tag"></strong>`;

const meta = {
  title: 'Headless/Tag',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
