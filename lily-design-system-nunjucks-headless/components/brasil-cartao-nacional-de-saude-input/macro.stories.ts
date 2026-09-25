import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="brasil-cartao-nacional-de-saude-input"
  type="text"
  autocomplete="off"
  spellcheck="false"
  aria-label="Brazil's Cartão Nacional de Saúde (CNS)">`;

const meta = {
  title: 'Headless/BrasilCartaoNacionalDeSaudeInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
