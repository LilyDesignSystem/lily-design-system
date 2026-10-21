import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<button\n  class=\"five-star-rating-picker-button\"\n  role=\"radio\" aria-checked=\"false\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides button content -->\n</button>";

const meta = {
  title: 'Headless/Five Star Rating Picker Button',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
