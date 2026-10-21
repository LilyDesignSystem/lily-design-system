import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- AccordionLink component -->\n<!--\n  Description: an accordion link\n  HTML tag: <a>\n  CSS class: accordion-link\n  Keyboard: Tab to focus, Enter to follow link\n  Accessibility: aria-label for accessible name\n-->\n\n<a\n  class=\"accordion-link\"\n  aria-label=\"\"\n  href=\"\"\n>\n  <!-- Consumer provides content -->\n</a>";

const meta = {
  title: 'Headless/Accordion Link',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
