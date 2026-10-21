import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- HangukJuminDeungnokBeonhoInput component -->\n<!--\n  Description: an input for entering South Korea's Resident Registration Number (주민등록번호)\n  HTML tag: <input>\n  CSS class: hanguk-jumin-deungnok-beonho-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: Thirteen digits, displayed as NNNNNN-NNNNNNN. The first six digits encode date of birth (YYMMDD); the seventh digit encodes sex and birth century; digits eight through eleven encode place of registration; the twelfth is a sequence number; the thirteenth is a Modulus-11 check digit over the preceding twelve.\n  Usage:\n    <input class=\"hanguk-jumin-deungnok-beonho-input\" type=\"text\" aria-label=\"Resident Registration Number (주민등록번호)\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"hanguk-jumin-deungnok-beonho-input\"\n  type=\"text\"\n  aria-label=\"Resident Registration Number (주민등록번호)\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Hanguk Jumin Deungnok Beonho Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
