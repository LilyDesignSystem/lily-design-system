import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div class=\"combobox\" x-data=\"lilyCombobox()\" x-bind=\"root\">\n  <input class=\"combobox-input\" type=\"text\" aria-label=\"\" aria-controls=\"combobox-listbox-1\" x-bind=\"input\">\n  <div class=\"combobox-listbox\" id=\"combobox-listbox-1\" aria-label=\"\" x-bind=\"listbox\">\n    <div class=\"combobox-option\" x-bind=\"option('combobox-option-1')\"><!-- Consumer provides option --></div>\n    <div class=\"combobox-option\" x-bind=\"option('combobox-option-2')\"><!-- Consumer provides option --></div>\n    <div class=\"combobox-option\" x-bind=\"option('combobox-option-3')\"><!-- Consumer provides option --></div>\n  </div>\n</div>";

const meta = {
  title: 'Headless/Combobox',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
