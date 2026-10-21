import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"espana-tarjeta-sanitaria-individual-view\"\n  aria-label=\"TSI\"\n></span>";

const meta = {
  title: 'Headless/Espana Tarjeta Sanitaria Individual View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
