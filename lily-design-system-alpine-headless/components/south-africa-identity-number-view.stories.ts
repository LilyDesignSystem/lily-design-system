import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- SouthAfricaIdentityNumberView component -->\n<!--\n  Description: a read-only display of South Africa's Identity Number\n  HTML tag: <span>\n  CSS class: south-africa-identity-number-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: Thirteen digits in the form YYMMDDSSSSCAZ: the first six encode date of birth; the next four encode sex (0000-4999 female, 5000-9999 male); the eleventh digit encodes citizenship status (0 citizen, 1 permanent resident, 2 refugee); the twelfth is a legacy field fixed at 8 on modern cards; the thirteenth is a Luhn (Modulus-10) check digit over the preceding twelve.\n  Usage:\n    <span class=\"south-africa-identity-number-view\" aria-label=\"South African Identity Number\">value-here</span>\n-->\n\n<span\n  class=\"south-africa-identity-number-view\"\n  aria-label=\"South African Identity Number\"\n></span>";

const meta = {
  title: 'Headless/South Africa Identity Number View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
