import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="espana-tarjeta-sanitaria-individual-input"
  type="text"
  id=""
  name=""
  value=""
  pattern="[A-Za-z0-9 \\-]{1,20}"
  maxlength="20"
  autocomplete="off"
  spellcheck="false">`;

const meta = {
  title: 'Headless/EspanaTarjetaSanitariaIndividualInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
