import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<figure\n  class=\"pictogram\"\n  data-layout=\"centered\"\n  aria-label=\"\"\n>\n  <div class=\"pictogram-icon\" aria-hidden=\"true\">\n    <!-- Consumer provides icon content (SVG, emoji, illustration) -->\n  </div>\n  <figcaption class=\"pictogram-caption\">\n    <h3 class=\"pictogram-heading\">\n      <!-- Consumer provides heading text (optional) -->\n    </h3>\n    <p class=\"pictogram-description\">\n      <!-- Consumer provides description text (optional) -->\n    </p>\n  </figcaption>\n</figure>";

const meta = {
  title: 'Headless/Pictogram',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
