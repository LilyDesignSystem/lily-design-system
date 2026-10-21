import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- SingaporeNationalRegistrationIdentityCardInput component -->\n<!--\n  Description: an input for entering Singapore's National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN)\n  HTML tag: <input>\n  CSS class: singapore-national-registration-identity-card-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: One letter (S or T for citizens/permanent residents; F or G for long-term foreign residents; M for newer FIN series), seven digits, and a trailing check letter. The check letter is computed by multiplying the seven digits by fixed weights (2,7,6,5,4,3,2), summing the products (adding 4 for a G/T prefix or 3 for an M prefix), taking the sum Modulus 11, and mapping (10 - remainder) through a lookup table to a letter.\n  Usage:\n    <input class=\"singapore-national-registration-identity-card-input\" type=\"text\" aria-label=\"National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN)\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"singapore-national-registration-identity-card-input\"\n  type=\"text\"\n  aria-label=\"National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN)\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Singapore National Registration Identity Card Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
