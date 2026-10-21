import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- EnglandNationalHealthServiceNumberInput component -->\n<!--\n  Description: an input for entering England's National Health Service Number (NHS)\n  HTML tag: <input>\n  CSS class: england-national-health-service-number-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: 10 digits in 3-3-4 format with a Modulus-11 check digit, allocated through the Personal Demographics Service\n  Usage:\n    <input class=\"england-national-health-service-number-input\" type=\"text\" aria-label=\"National Health Service Number\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"england-national-health-service-number-input\"\n  type=\"text\"\n  aria-label=\"National Health Service Number\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/England National Health Service Number Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
