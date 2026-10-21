import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- HangukJuminDeungnokBeonhoView component -->\n<!--\n  Description: a read-only display of South Korea's Resident Registration Number (주민등록번호)\n  HTML tag: <span>\n  CSS class: hanguk-jumin-deungnok-beonho-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: Thirteen digits, displayed as NNNNNN-NNNNNNN. The first six digits encode date of birth (YYMMDD); the seventh digit encodes sex and birth century; digits eight through eleven encode place of registration; the twelfth is a sequence number; the thirteenth is a Modulus-11 check digit over the preceding twelve.\n  Usage:\n    <span class=\"hanguk-jumin-deungnok-beonho-view\" aria-label=\"Resident Registration Number (주민등록번호)\">value-here</span>\n-->\n\n<span\n  class=\"hanguk-jumin-deungnok-beonho-view\"\n  aria-label=\"Resident Registration Number (주민등록번호)\"\n></span>";

const meta = {
  title: 'Headless/Hanguk Jumin Deungnok Beonho View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
