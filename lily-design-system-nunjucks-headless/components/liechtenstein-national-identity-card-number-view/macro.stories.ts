import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="liechtenstein-national-identity-card-number-view"
  aria-label="Liechtenstein National Identity Card Number">sample-value</span>`;

const meta = {
  title: 'Headless/LiechtensteinNationalIdentityCardNumberView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
