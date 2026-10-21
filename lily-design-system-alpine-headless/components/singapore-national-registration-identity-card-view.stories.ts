import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- SingaporeNationalRegistrationIdentityCardView component -->\n<!--\n  Description: a read-only display of Singapore's National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN)\n  HTML tag: <span>\n  CSS class: singapore-national-registration-identity-card-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: One letter (S or T for citizens/permanent residents; F or G for long-term foreign residents; M for newer FIN series), seven digits, and a trailing check letter. The check letter is computed by multiplying the seven digits by fixed weights (2,7,6,5,4,3,2), summing the products (adding 4 for a G/T prefix or 3 for an M prefix), taking the sum Modulus 11, and mapping (10 - remainder) through a lookup table to a letter.\n  Usage:\n    <span class=\"singapore-national-registration-identity-card-view\" aria-label=\"National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN)\">value-here</span>\n-->\n\n<span\n  class=\"singapore-national-registration-identity-card-view\"\n  aria-label=\"National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN)\"\n></span>";

const meta = {
  title: 'Headless/Singapore National Registration Identity Card View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
