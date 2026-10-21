import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- PrathetThaiLekPrajamTuaPrachachonInput component -->\n<!--\n  Description: an input for entering Thailand's National Identification Number\n  HTML tag: <input>\n  CSS class: prathet-thai-lek-prajam-tua-prachachon-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: Thirteen digits: category, office, serial, Modulus-11 check digit, disambiguators.\n  Usage:\n    <input class=\"prathet-thai-lek-prajam-tua-prachachon-input\" type=\"text\" aria-label=\"เลขประจำตัวประชาชน (Lek Prajam Tua Prachachon)\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"prathet-thai-lek-prajam-tua-prachachon-input\"\n  type=\"text\"\n  aria-label=\"เลขประจำตัวประชาชน (Lek Prajam Tua Prachachon)\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Prathet Thai Lek Prajam Tua Prachachon Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
