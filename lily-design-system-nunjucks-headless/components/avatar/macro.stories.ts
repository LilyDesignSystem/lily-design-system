import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="avatar"
  role="img"></span>`;

const meta = {
  title: 'Headless/Avatar',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
