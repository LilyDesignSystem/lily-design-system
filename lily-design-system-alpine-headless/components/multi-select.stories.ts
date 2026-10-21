import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<select\n  class=\"multi-select\"\n  multiple\n  aria-label=\"Toppings\"\n  size=\"4\"\n>\n  <option value=\"cheese\">Cheese</option>\n  <option value=\"olives\">Olives</option>\n  <option value=\"peppers\">Peppers</option>\n  <option value=\"mushrooms\">Mushrooms</option>\n</select>";

const meta = {
  title: 'Headless/Multi Select',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
