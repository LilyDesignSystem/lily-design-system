import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- NederlandBurgerserviceNummerInput component -->\n<!--\n  Description: an input for entering Netherlands's Burgerservicenummer (BSN)\n  HTML tag: <input>\n  CSS class: nederland-burgerservice-nummer-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: 9-digit number issued via the Personal Records Database (BRP); validated with a variant of the eleven-test (Luhn) algorithm\n  Usage:\n    <input class=\"nederland-burgerservice-nummer-input\" type=\"text\" aria-label=\"Citizen Service Number\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"nederland-burgerservice-nummer-input\"\n  type=\"text\"\n  aria-label=\"Citizen Service Number\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Nederland Burgerservice Nummer Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
