import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<li\n  class=\"validation-list-item\"\n  data-status=\"pending\"\n  aria-label=\"\"\n>\n  <!-- Consumer-provided rule text (e.g. \"At least 8 characters\") -->\n</li>";

const meta = {
  title: 'Headless/Validation List Item',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
