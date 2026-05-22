import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="ireland-individual-health-identifier-input"
  type="text"
  id=""
  name=""
  value=""
  inputmode="numeric"
  pattern="[0-9 \\-]{7,9}"
  maxlength="9"
  autocomplete="off"
  spellcheck="false">`;

const meta = {
  title: 'Headless/IrelandIndividualHealthIdentifierInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
