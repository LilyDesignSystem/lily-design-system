import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div class=\"accordion-checkbox\" x-data=\"lilyCheckboxAccordion(false)\">\n  <input class=\"accordion-checkbox-input\" type=\"checkbox\" id=\"accordion-checkbox-1\" x-bind=\"input\" aria-controls=\"accordion-checkbox-1-panel\">\n  <label class=\"accordion-checkbox-label\" for=\"accordion-checkbox-1\"><!-- Consumer provides label --></label>\n  <div class=\"accordion-checkbox-panel\" id=\"accordion-checkbox-1-panel\" role=\"region\" aria-labelledby=\"accordion-checkbox-1\" x-bind=\"panel\">\n    <!-- Consumer provides revealable panel content -->\n  </div>\n</div>";

const meta = {
  title: 'Headless/Accordion Checkbox',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
