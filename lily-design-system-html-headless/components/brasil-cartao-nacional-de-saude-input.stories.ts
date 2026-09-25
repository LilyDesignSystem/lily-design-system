import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="brasil-cartao-nacional-de-saude-input"
  type="text"
  aria-label="Cartão Nacional de Saúde (CNS)"
  autocomplete="off"
>`;

const meta = {
  title: 'Headless/BrasilCartaoNacionalDeSaudeInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
