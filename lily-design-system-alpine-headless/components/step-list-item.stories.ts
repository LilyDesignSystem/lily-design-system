import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<li\n  class=\"step-list-item\"\n  data-status=\"waiting\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides the step content (typically title and description) -->\n</li>";

const meta = {
  title: 'Headless/Step List Item',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
