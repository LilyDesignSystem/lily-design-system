import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- LiechtensteinNationalIdentityCardNumberInput component -->\n<!--\n  Description: an input for entering Liechtenstein's Liechtenstein National Identity Card Number\n  HTML tag: <input>\n  CSS class: liechtenstein-national-identity-card-number-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: 2 letters followed by 8 digits (e.g. ID022143586); changes with each renewed card\n  Usage:\n    <input class=\"liechtenstein-national-identity-card-number-input\" type=\"text\" aria-label=\"Liechtenstein National Identity Card Number\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"liechtenstein-national-identity-card-number-input\"\n  type=\"text\"\n  aria-label=\"Liechtenstein National Identity Card Number\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Liechtenstein National Identity Card Number Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
