import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Masonry component -->\n<!--\n  Description: a masonry layout container for variable-height items using CSS multi-column flow\n\n  HTML tag: <div>\n  CSS class: masonry\n  Keyboard: None (passive layout container)\n  Accessibility: None — purely structural layout container\n\n  Behavior:\n    Uses the CSS multi-column approach: column-count and column-gap.\n    Children flow vertically through each column. Consumers should apply\n    \"break-inside: avoid\" to direct children so items do not break across columns.\n    The data-columns attribute is exposed for consumer CSS hooks.\n\n  Usage:\n    <div class=\"masonry\" data-columns=\"3\"\n         style=\"column-count: 3; column-gap: 1rem;\">\n      <div style=\"break-inside: avoid;\">...</div>\n      <div style=\"break-inside: avoid;\">...</div>\n      <div style=\"break-inside: avoid;\">...</div>\n    </div>\n-->\n\n<div\n  class=\"masonry\"\n  data-columns=\"3\"\n  style=\"column-count: 3; column-gap: 1rem;\"\n>\n  <!-- Consumer provides masonry items; each item should have break-inside: avoid -->\n</div>";

const meta = {
  title: 'Headless/Masonry',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
