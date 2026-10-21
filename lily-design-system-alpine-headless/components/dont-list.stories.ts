import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- DontList component -->\n<!--\n  Description: a guideline list of discouraged dont-list-item components\n  HTML tag: <ul>\n  CSS class: dont-list\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <ul class=\"dont-list\" aria-label=\"Example\">\n      ...\n    </ul>\n-->\n\n<ul\n  class=\"dont-list\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides list items -->\n</ul>";

const meta = {
  title: 'Headless/Dont List',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
