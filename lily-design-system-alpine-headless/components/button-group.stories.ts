import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div\n  class=\"button-group\"\n  role=\"group\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides related <button> elements as children -->\n</div>";

const meta = {
  title: 'Headless/Button Group',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
