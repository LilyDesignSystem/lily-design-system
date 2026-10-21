import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<section\n  class=\"info-state\"\n  role=\"status\"\n  data-level=\"info\"\n  aria-label=\"\"\n>\n  <!-- Optional illustration slot -->\n  <div class=\"info-state-illustration\">\n    <!-- Consumer provides illustration content (SVG, image, etc.) -->\n  </div>\n\n  <!-- Required title heading -->\n  <h2 class=\"info-state-title\">\n    <!-- Consumer provides title text -->\n  </h2>\n\n  <!-- Optional description -->\n  <p class=\"info-state-description\">\n    <!-- Consumer provides description text -->\n  </p>\n\n  <!-- Optional action area for call-to-action buttons -->\n  <div class=\"info-state-action\">\n    <!-- Consumer provides action buttons -->\n  </div>\n</section>";

const meta = {
  title: 'Headless/Info State',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
