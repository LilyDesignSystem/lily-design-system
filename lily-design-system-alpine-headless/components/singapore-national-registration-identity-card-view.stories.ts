import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"singapore-national-registration-identity-card-view\"\n  aria-label=\"National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN)\"\n></span>";

const meta = {
  title: 'Headless/Singapore National Registration Identity Card View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
