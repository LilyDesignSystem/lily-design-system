import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- PrathetThaiLekPrajamTuaPrachachonView component -->\n<!--\n  Description: a read-only display of Thailand's National Identification Number\n  HTML tag: <span>\n  CSS class: prathet-thai-lek-prajam-tua-prachachon-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: Thirteen digits: category, office, serial, Modulus-11 check digit, disambiguators.\n  Usage:\n    <span class=\"prathet-thai-lek-prajam-tua-prachachon-view\" aria-label=\"เลขประจำตัวประชาชน (Lek Prajam Tua Prachachon)\">value-here</span>\n-->\n\n<span\n  class=\"prathet-thai-lek-prajam-tua-prachachon-view\"\n  aria-label=\"เลขประจำตัวประชาชน (Lek Prajam Tua Prachachon)\"\n></span>";

const meta = {
  title: 'Headless/Prathet Thai Lek Prajam Tua Prachachon View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
