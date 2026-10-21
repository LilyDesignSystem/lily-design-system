import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<hr\n  class=\"separator\"\n  role=\"separator\"\n  aria-label=\"\"\n>";

const meta = {
  title: 'Headless/Separator',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
