import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- BrasilCartaoNacionalDeSaudeView component -->\n<!--\n  Description: a read-only display of Brazil's Cartão Nacional de Saúde (CNS)\n  HTML tag: <span>\n  CSS class: brasil-cartao-nacional-de-saude-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: Fifteen-digit number issued by Brazil's Sistema Único de Saúde (SUS), grouped as NNN NNNN NNNN NNNN. Numbers starting 1 or 2 are definitive (linked to the national civil registry); numbers starting 7, 8, or 9 are provisional. Both forms are validated with a weighted-sum Modulus-11 check across all 15 digits.\n  Usage:\n    <span class=\"brasil-cartao-nacional-de-saude-view\" aria-label=\"Cartão Nacional de Saúde (CNS)\">value-here</span>\n-->\n\n<span\n  class=\"brasil-cartao-nacional-de-saude-view\"\n  aria-label=\"Cartão Nacional de Saúde (CNS)\"\n></span>";

const meta = {
  title: 'Headless/Brasil Cartao Nacional De Saude View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
