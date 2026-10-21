import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"brasil-cartao-nacional-de-saude-view\"\n  aria-label=\"Cartão Nacional de Saúde (CNS)\"\n></span>";

const meta = {
  title: 'Headless/Brasil Cartao Nacional De Saude View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
