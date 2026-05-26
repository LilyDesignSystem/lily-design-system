import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="liechtenstein-national-identity-card-number-input"
  type="text"
  aria-label="Liechtenstein National Identity Card Number"
  autocomplete="off"
>`;

const meta = {
  title: 'Headless/LiechtensteinNationalIdentityCardNumberInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
