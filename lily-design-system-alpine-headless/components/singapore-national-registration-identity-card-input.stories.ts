import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"singapore-national-registration-identity-card-input\"\n  type=\"text\"\n  aria-label=\"National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN)\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Singapore National Registration Identity Card Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
