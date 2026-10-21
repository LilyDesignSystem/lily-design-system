import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<dl\n  class=\"description-list\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</dl>";

const meta = {
  title: 'Headless/Description List',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
