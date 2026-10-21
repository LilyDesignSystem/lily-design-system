import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Pictogram component -->\n<!--\n  Description: an icon-based component pairing an icon with a title and description in a centered or side layout\n  HTML tag: <figure>\n  CSS class: pictogram\n  Keyboard: None (passive element)\n  Accessibility:\n    - <figure> semantics; accessible name comes from the heading or aria-label\n    - data-layout exposes \"centered\" or \"side\" for styling\n    - icon container uses aria-hidden=\"true\" because it is decorative\n    - heading and description carry the meaningful text\n  Usage:\n    <figure\n      class=\"pictogram\"\n      data-layout=\"centered\"\n      aria-label=\"Privacy\"\n    >\n      <div class=\"pictogram-icon\" aria-hidden=\"true\">\n        <svg>...</svg>\n      </div>\n      <figcaption class=\"pictogram-caption\">\n        <h3 class=\"pictogram-heading\">Privacy</h3>\n        <p class=\"pictogram-description\">Your data stays on your device.</p>\n      </figcaption>\n    </figure>\n-->\n\n<figure\n  class=\"pictogram\"\n  data-layout=\"centered\"\n  aria-label=\"\"\n>\n  <div class=\"pictogram-icon\" aria-hidden=\"true\">\n    <!-- Consumer provides icon content (SVG, emoji, illustration) -->\n  </div>\n  <figcaption class=\"pictogram-caption\">\n    <h3 class=\"pictogram-heading\">\n      <!-- Consumer provides heading text (optional) -->\n    </h3>\n    <p class=\"pictogram-description\">\n      <!-- Consumer provides description text (optional) -->\n    </p>\n  </figcaption>\n</figure>";

const meta = {
  title: 'Headless/Pictogram',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
