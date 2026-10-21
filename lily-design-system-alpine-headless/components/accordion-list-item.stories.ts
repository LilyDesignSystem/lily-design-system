import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- AccordionListItem component -->\n<!--\n  Description: one accordion list item component\n  HTML tag: <li> wrapped in <ol>\n  CSS class: accordion-list-item\n  Accessibility: aria-label for accessible name\n-->\n\n<ol><li class=\"accordion-list-item\" aria-label=\"Example\">\n    <!-- Consumer provides child content -->\n</li></ol>";

const meta = {
  title: 'Headless/Accordion List Item',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
