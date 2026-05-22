import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="espana-tarjeta-sanitaria-individual-view"></span>`;

const meta = {
  title: 'Headless/EspanaTarjetaSanitariaIndividualView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
