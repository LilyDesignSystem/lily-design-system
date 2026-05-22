import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<cite
  class="citation"></cite>`;

const meta = {
  title: 'Headless/Citation',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
