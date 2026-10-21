import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- MultiSelectWithExtras component -->\n<!--\n  Description: a native multiple-choice select wrapped in a div with before/after content slots\n  HTML tag: <div> wrapping <select multiple>\n  CSS class: multi-select-with-extras\n  Keyboard: native only (on the inner select)\n  Accessibility: aria-label is on the inner <select>, not the wrapper div\n  Attributes: extra attributes pass through on the wrapper div; size/required/disabled go on the select\n  Usage:\n    <div class=\"multi-select-with-extras\">\n      … before content …\n      <select multiple aria-label=\"Example\"> ... </select>\n      … after content …\n    </div>\n-->\n\n<div class=\"multi-select-with-extras\">\n  <span class=\"multi-select-with-extras-before\">Choose toppings</span>\n  <select multiple aria-label=\"Toppings\" size=\"4\">\n    <option value=\"cheese\">Cheese</option>\n    <option value=\"olives\">Olives</option>\n    <option value=\"peppers\">Peppers</option>\n    <option value=\"mushrooms\">Mushrooms</option>\n  </select>\n  <span class=\"multi-select-with-extras-after\">Hold Ctrl or Cmd to select several</span>\n</div>";

const meta = {
  title: 'Headless/Multi Select With Extras',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
