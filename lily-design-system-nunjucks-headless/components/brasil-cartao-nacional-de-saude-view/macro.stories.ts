import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="brasil-cartao-nacional-de-saude-view"
  aria-label="Brazil's Cartão Nacional de Saúde (CNS)">Sample value</span>`;

const meta = {
  title: 'Headless/BrasilCartaoNacionalDeSaudeView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
