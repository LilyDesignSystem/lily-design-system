import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="ireland-individual-health-identifier-input"
  type="text"
  aria-label=""
  inputmode="numeric"
  pattern="[0-9]{10}"
  autocomplete="off"
>`;

const meta = {
  title: 'Headless/IrelandIndividualHealthIdentifierInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
