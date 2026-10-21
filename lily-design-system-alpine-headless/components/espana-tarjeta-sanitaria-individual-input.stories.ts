import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"espana-tarjeta-sanitaria-individual-input\"\n  type=\"text\"\n  aria-label=\"\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Espana Tarjeta Sanitaria Individual Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
