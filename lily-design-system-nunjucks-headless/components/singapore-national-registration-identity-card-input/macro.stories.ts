import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="singapore-national-registration-identity-card-input"
  type="text"
  autocomplete="off"
  spellcheck="false"
  aria-label="Singapore's National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN)">`;

const meta = {
  title: 'Headless/SingaporeNationalRegistrationIdentityCardInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
