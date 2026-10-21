import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- NederlandIdentiteitskaartNummerInput component -->\n<!--\n  Description: an input for entering Netherlands's Identiteitskaart Nummer\n  HTML tag: <input>\n  CSS class: nederland-identiteitskaart-nummer-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: 9 characters following the same format as the passport number; 'O' is disallowed but '0' is permitted\n  Usage:\n    <input class=\"nederland-identiteitskaart-nummer-input\" type=\"text\" aria-label=\"Dutch National Identity Card Number\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"nederland-identiteitskaart-nummer-input\"\n  type=\"text\"\n  aria-label=\"Dutch National Identity Card Number\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Nederland Identiteitskaart Nummer Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
