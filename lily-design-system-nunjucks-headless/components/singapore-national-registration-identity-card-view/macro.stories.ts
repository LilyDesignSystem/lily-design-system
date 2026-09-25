import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="singapore-national-registration-identity-card-view"
  aria-label="Singapore's National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN)">Sample value</span>`;

const meta = {
  title: 'Headless/SingaporeNationalRegistrationIdentityCardView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
