import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- UnitedKingdomNationalHealthServiceNumberInput component -->\n<!--\n  Description: an input for entering a UK NHS number\n  HTML tag: <input>\n  CSS class: united-kingdom-national-health-service-number-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Usage:\n    <input class=\"united-kingdom-national-health-service-number-input\" type=\"text\" aria-label=\"Example\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"united-kingdom-national-health-service-number-input\"\n  type=\"text\"\n  aria-label=\"\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/United Kingdom National Health Service Number Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
