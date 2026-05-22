import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="espana-tarjeta-sanitaria-individual-input"
  type="text"
  aria-label=""
  autocomplete="off"
>`;

const meta = {
  title: 'Headless/EspanaTarjetaSanitariaIndividualInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
