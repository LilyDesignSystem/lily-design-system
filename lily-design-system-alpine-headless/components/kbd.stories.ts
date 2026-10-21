import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Kbd component -->\n<!--\n  Description: show keyboard shortcuts and key combinations in a styled inline element\n  HTML tag: <kbd>\n  CSS class: kbd\n  Accessibility: aria-label for accessible name\n-->\n\n<kbd\n  class=\"kbd\"\n  aria-label=\"Example\"\n>\n  <!-- Consumer provides content -->\n</kbd>";

const meta = {
  title: 'Headless/Kbd',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
