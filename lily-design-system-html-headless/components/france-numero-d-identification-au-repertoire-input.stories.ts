import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="france-numero-d-identification-au-repertoire-input"
  type="text"
  aria-label=""
  inputmode="numeric"
  pattern="[0-9]{1} [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{3} [0-9]{3} [0-9]{2}"
  autocomplete="off"
>`;

const meta = {
  title: 'Headless/FranceNumeroDIdentificationAuRepertoireInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
