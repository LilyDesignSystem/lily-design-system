import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- DigitalObjectIdentifierLink component -->\n<!--\n  Description: a permanent hyperlink for a Digital Object Identifier (DOI) to an electronic source\n  HTML tag: <a>\n  CSS class: digital-object-identifier-link\n  Keyboard: Tab to focus, Enter to follow link\n  Accessibility: aria-label for accessible name\n-->\n\n<a\n  class=\"digital-object-identifier-link\"\n  aria-label=\"\"\n  href=\"\"\n>\n  <!-- Consumer provides content -->\n</a>";

const meta = {
  title: 'Headless/Digital Object Identifier Link',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
