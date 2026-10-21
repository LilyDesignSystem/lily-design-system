import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- BrasilCartaoNacionalDeSaudeInput component -->\n<!--\n  Description: an input for entering Brazil's Cartão Nacional de Saúde (CNS)\n  HTML tag: <input>\n  CSS class: brasil-cartao-nacional-de-saude-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: Fifteen-digit number issued by Brazil's Sistema Único de Saúde (SUS), grouped as NNN NNNN NNNN NNNN. Numbers starting 1 or 2 are definitive (linked to the national civil registry); numbers starting 7, 8, or 9 are provisional. Both forms are validated with a weighted-sum Modulus-11 check across all 15 digits.\n  Usage:\n    <input class=\"brasil-cartao-nacional-de-saude-input\" type=\"text\" aria-label=\"Cartão Nacional de Saúde (CNS)\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"brasil-cartao-nacional-de-saude-input\"\n  type=\"text\"\n  aria-label=\"Cartão Nacional de Saúde (CNS)\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Brasil Cartao Nacional De Saude Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
