import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- AccordionList component -->\n<!--\n  Description: a grouped container of accordion list item components\n  HTML tag: <div>  (not <ol>, because <details> is not valid inside <ol>/<ul>)\n  CSS class: accordion-list\n  Keyboard: None (passive element)\n  Accessibility: role=\"group\" + aria-label\n  Usage:\n    <div class=\"accordion-list\" role=\"group\" aria-label=\"Example\">\n      ...\n    </div>\n-->\n\n<div class=\"accordion-list\" role=\"group\" aria-label=\"\">\n    <!-- Consumer provides accordion list items -->\n</div>";

const meta = {
  title: 'Headless/Accordion List',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
