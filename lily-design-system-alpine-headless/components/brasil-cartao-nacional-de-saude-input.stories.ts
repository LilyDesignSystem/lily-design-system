import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"brasil-cartao-nacional-de-saude-input\"\n  type=\"text\"\n  aria-label=\"Cartão Nacional de Saúde (CNS)\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Brasil Cartao Nacional De Saude Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
