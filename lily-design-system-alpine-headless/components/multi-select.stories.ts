import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- MultiSelect component -->\n<!--\n  Description: a native multiple-choice select (listbox) from which several options can be chosen\n  HTML tag: <select multiple>\n  CSS class: multi-select\n  Keyboard: native only (Arrow keys move, Shift+Arrow extends, Ctrl/Cmd+click toggles)\n  Accessibility: aria-label for accessible name; native listbox semantics\n  Attributes: size (visible rows), required, disabled, name; options are <option> children\n  Usage:\n    <select class=\"multi-select\" multiple aria-label=\"Example\" size=\"4\">\n      <option value=\"a\">A</option>\n    </select>\n-->\n\n<select\n  class=\"multi-select\"\n  multiple\n  aria-label=\"Toppings\"\n  size=\"4\"\n>\n  <option value=\"cheese\">Cheese</option>\n  <option value=\"olives\">Olives</option>\n  <option value=\"peppers\">Peppers</option>\n  <option value=\"mushrooms\">Mushrooms</option>\n</select>";

const meta = {
  title: 'Headless/Multi Select',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
