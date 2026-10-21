import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- InfoState component -->\n<!--\n  Description: a composition of illustration, title, description, and action for empty, error, info, or success states\n\n  HTML tag: <section>\n  CSS class: info-state\n  Keyboard: None (passive container; nested action buttons handle their own keyboard interaction)\n  Accessibility: role=\"status\" announces state changes politely; aria-label provides the accessible name (defaults to the title)\n\n  Behavior:\n    Renders a <section> landmark with role=\"status\" and a data-level attribute\n    that consumer CSS may key on (\"info\", \"empty\", \"error\", \"success\").\n    Inner structure is consumer-supplied: typically an optional illustration,\n    a heading <h2 class=\"info-state-title\">, an optional description\n    <p class=\"info-state-description\">, and an optional action area\n    <div class=\"info-state-action\">.\n\n  Usage:\n    <section class=\"info-state\" role=\"status\" data-level=\"empty\" aria-label=\"No results\">\n      <div class=\"info-state-illustration\">...</div>\n      <h2 class=\"info-state-title\">No results</h2>\n      <p class=\"info-state-description\">Try adjusting your filters.</p>\n      <div class=\"info-state-action\">\n        <button class=\"button\">Reset</button>\n      </div>\n    </section>\n-->\n\n<section\n  class=\"info-state\"\n  role=\"status\"\n  data-level=\"info\"\n  aria-label=\"\"\n>\n  <!-- Optional illustration slot -->\n  <div class=\"info-state-illustration\">\n    <!-- Consumer provides illustration content (SVG, image, etc.) -->\n  </div>\n\n  <!-- Required title heading -->\n  <h2 class=\"info-state-title\">\n    <!-- Consumer provides title text -->\n  </h2>\n\n  <!-- Optional description -->\n  <p class=\"info-state-description\">\n    <!-- Consumer provides description text -->\n  </p>\n\n  <!-- Optional action area for call-to-action buttons -->\n  <div class=\"info-state-action\">\n    <!-- Consumer provides action buttons -->\n  </div>\n</section>";

const meta = {
  title: 'Headless/Info State',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
