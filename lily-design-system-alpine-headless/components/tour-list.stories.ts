import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- TourList component -->\n<!--\n  Description: an ordered list of tour guide steps\n  HTML tag: <ol>\n  CSS class: tour-list\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <ol class=\"tour-list\" aria-label=\"Example\">\n      ...\n    </ol>\n-->\n\n<ol\n  class=\"tour-list\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides list items -->\n</ol>";

const meta = {
  title: 'Headless/Tour List',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
