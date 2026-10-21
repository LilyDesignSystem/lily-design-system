import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<a\n  class=\"download-button\"\n  href=\"#\"\n  aria-label=\"\"\n  data-file-size=\"\"\n  data-file-format=\"\"\n  download\n>\n  <!-- Consumer provides button content (defaults to label if omitted) -->\n</a>";

const meta = {
  title: 'Headless/Download Button',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
