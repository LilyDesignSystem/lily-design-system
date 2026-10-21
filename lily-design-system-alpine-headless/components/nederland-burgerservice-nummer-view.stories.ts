import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- NederlandBurgerserviceNummerView component -->\n<!--\n  Description: a read-only display of Netherlands's Burgerservicenummer (BSN)\n  HTML tag: <span>\n  CSS class: nederland-burgerservice-nummer-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: 9-digit number issued via the Personal Records Database (BRP); validated with a variant of the eleven-test (Luhn) algorithm\n  Usage:\n    <span class=\"nederland-burgerservice-nummer-view\" aria-label=\"Citizen Service Number\">value-here</span>\n-->\n\n<span\n  class=\"nederland-burgerservice-nummer-view\"\n  aria-label=\"Citizen Service Number\"\n></span>";

const meta = {
  title: 'Headless/Nederland Burgerservice Nummer View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
