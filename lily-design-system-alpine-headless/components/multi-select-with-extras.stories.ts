import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div class=\"multi-select-with-extras\">\n  <span class=\"multi-select-with-extras-before\">Choose toppings</span>\n  <select multiple aria-label=\"Toppings\" size=\"4\">\n    <option value=\"cheese\">Cheese</option>\n    <option value=\"olives\">Olives</option>\n    <option value=\"peppers\">Peppers</option>\n    <option value=\"mushrooms\">Mushrooms</option>\n  </select>\n  <span class=\"multi-select-with-extras-after\">Hold Ctrl or Cmd to select several</span>\n</div>";

const meta = {
  title: 'Headless/Multi Select With Extras',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
