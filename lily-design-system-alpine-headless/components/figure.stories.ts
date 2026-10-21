import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<figure\n  class=\"figure\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides figure content and optional caption -->\n</figure>";

const meta = {
  title: 'Headless/Figure',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
