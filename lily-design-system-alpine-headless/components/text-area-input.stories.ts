import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<textarea\n  class=\"text-area-input\"\n  aria-label=\"Example\"\n>\n  <!-- Consumer provides content -->\n</textarea>";

const meta = {
  title: 'Headless/Text Area Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
