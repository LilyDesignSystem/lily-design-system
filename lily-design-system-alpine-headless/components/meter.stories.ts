import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<meter\n  class=\"meter\"\n  aria-label=\"\"\n  min=\"0\"\n  max=\"100\"\n  value=\"0\"\n>\n  <!-- Consumer provides fallback text -->\n</meter>";

const meta = {
  title: 'Headless/Meter',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
