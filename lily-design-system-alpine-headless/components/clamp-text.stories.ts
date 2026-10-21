import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div\n  class=\"clamp-text\"\n  data-lines=\"2\"\n  style=\"--clamp-text-lines: 2;\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides text content; full text remains in DOM and accessible to screen readers -->\n</div>";

const meta = {
  title: 'Headless/Clamp Text',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
