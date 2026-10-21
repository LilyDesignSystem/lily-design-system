import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<aside\n  class=\"summary-box\"\n  aria-label=\"\"\n>\n  <h3 class=\"summary-box-heading\">\n    <!-- Consumer-provided heading text -->\n  </h3>\n  <div class=\"summary-box-body\">\n    <!-- Consumer-provided body content -->\n  </div>\n</aside>";

const meta = {
  title: 'Headless/Summary Box',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
