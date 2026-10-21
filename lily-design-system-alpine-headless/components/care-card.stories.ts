import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- CareCard component -->\n<!--\n  Description: a medical care instruction card with urgency levels\n  HTML tag: <div>\n  CSS class: care-card\n  Keyboard: None (passive element)\n  Accessibility: role=\"region\", aria-label for accessible name\n  Usage:\n    <div class=\"care-card\" role=\"region\" aria-label=\"Example\">\n      ...\n    </div>\n-->\n\n<div\n  class=\"care-card\"\n  role=\"region\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Care Card',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
