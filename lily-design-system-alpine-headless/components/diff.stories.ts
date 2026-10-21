import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div\n  class=\"diff\"\n  role=\"group\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Diff',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
