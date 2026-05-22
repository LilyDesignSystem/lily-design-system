import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="france-numero-d-identification-au-repertoire-input"
  type="text"
  id=""
  name=""
  value=""
  inputmode="numeric"
  pattern="[0-9A-B ]{15,21}"
  maxlength="21"
  autocomplete="off"
  spellcheck="false">`;

const meta = {
  title: 'Headless/FranceNumeroDIdentificationAuRepertoireInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
