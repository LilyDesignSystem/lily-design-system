import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- SouthAfricaIdentityNumberInput component -->\n<!--\n  Description: an input for entering South Africa's Identity Number\n  HTML tag: <input>\n  CSS class: south-africa-identity-number-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: Thirteen digits in the form YYMMDDSSSSCAZ: the first six encode date of birth; the next four encode sex (0000-4999 female, 5000-9999 male); the eleventh digit encodes citizenship status (0 citizen, 1 permanent resident, 2 refugee); the twelfth is a legacy field fixed at 8 on modern cards; the thirteenth is a Luhn (Modulus-10) check digit over the preceding twelve.\n  Usage:\n    <input class=\"south-africa-identity-number-input\" type=\"text\" aria-label=\"South African Identity Number\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"south-africa-identity-number-input\"\n  type=\"text\"\n  aria-label=\"South African Identity Number\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/South Africa Identity Number Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
