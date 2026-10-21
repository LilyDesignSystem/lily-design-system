import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<progress\n  class=\"progress\"\n  aria-label=\"\"\n  max=\"100\"\n  value=\"0\"\n>\n  <!-- Consumer provides fallback text -->\n</progress>";

const meta = {
  title: 'Headless/Progress',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
