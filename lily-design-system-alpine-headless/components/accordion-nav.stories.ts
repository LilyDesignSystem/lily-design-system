import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<nav class=\"accordion-nav\" aria-label=\"\" x-data=\"lilyAccordion(false)\">\n  <ol class=\"accordion-list\">\n    <li class=\"accordion-list-item\">\n      <button class=\"accordion-trigger\" x-bind=\"trigger('one')\"><!-- Consumer provides heading --></button>\n      <div class=\"accordion-panel\" x-bind=\"panel('one')\"><!-- Consumer provides content --></div>\n    </li>\n    <li class=\"accordion-list-item\">\n      <button class=\"accordion-trigger\" x-bind=\"trigger('two')\"><!-- Consumer provides heading --></button>\n      <div class=\"accordion-panel\" x-bind=\"panel('two')\"><!-- Consumer provides content --></div>\n    </li>\n  </ol>\n</nav>";

const meta = {
  title: 'Headless/Accordion Nav',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
