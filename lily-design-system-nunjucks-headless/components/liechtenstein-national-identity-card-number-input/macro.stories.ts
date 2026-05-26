import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="liechtenstein-national-identity-card-number-input"
  type="text"
  autocomplete="off"
  spellcheck="false"
  aria-label="Liechtenstein National Identity Card Number">`;

const meta = {
  title: 'Headless/LiechtensteinNationalIdentityCardNumberInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
