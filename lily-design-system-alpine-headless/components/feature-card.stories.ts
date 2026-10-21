import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<article\n  class=\"feature-card\"\n  data-image-position=\"start\"\n  aria-label=\"\"\n>\n  <img class=\"feature-card-image\" src=\"\" alt=\"\">\n  <header class=\"feature-card-header\">\n    <h3 class=\"feature-card-heading\">\n      <!-- Consumer provides heading text -->\n    </h3>\n  </header>\n  <p class=\"feature-card-description\">\n    <!-- Consumer provides description text (optional) -->\n  </p>\n  <!-- Consumer provides additional content (e.g., CTAs) -->\n</article>";

const meta = {
  title: 'Headless/Feature Card',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
