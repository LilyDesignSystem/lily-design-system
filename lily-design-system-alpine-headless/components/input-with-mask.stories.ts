import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div\n  class=\"input-with-mask\"\n  data-mask=\"\"\n>\n  <span\n    class=\"input-with-mask-display\"\n    aria-hidden=\"true\"\n  >\n    <!-- Consumer renders the mask string here as a decorative overlay/placeholder -->\n  </span>\n  <input\n    class=\"input-with-mask-control\"\n    type=\"text\"\n    aria-label=\"\"\n    value=\"\"\n  >\n</div>";

const meta = {
  title: 'Headless/Input With Mask',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
