import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div class=\"command\" role=\"search\" aria-label=\"\" x-data=\"lilyCommand()\">\n  <input class=\"command-input\" type=\"search\" autocomplete=\"off\" aria-label=\"\" aria-controls=\"command-listbox-1\" x-bind=\"input\">\n  <div class=\"command-listbox\" id=\"command-listbox-1\" role=\"listbox\" aria-label=\"\">\n    <div class=\"command-option\" x-bind=\"option('command-option-1')\"><!-- Consumer provides option --></div>\n    <div class=\"command-option\" x-bind=\"option('command-option-2')\"><!-- Consumer provides option --></div>\n    <div class=\"command-option\" x-bind=\"option('command-option-3')\"><!-- Consumer provides option --></div>\n  </div>\n</div>";

const meta = {
  title: 'Headless/Command',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
