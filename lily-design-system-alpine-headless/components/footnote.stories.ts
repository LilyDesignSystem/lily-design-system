import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<aside\n  class=\"footnote\"\n  id=\"\"\n  role=\"note\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides footnote content -->\n</aside>";

const meta = {
  title: 'Headless/Footnote',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
