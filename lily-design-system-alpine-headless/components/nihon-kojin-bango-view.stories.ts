import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- NihonKojinBangoView component -->\n<!--\n  Description: a read-only display of Japan's Individual Number / My Number (マイナンバー)\n  HTML tag: <span>\n  CSS class: nihon-kojin-bango-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: Twelve digits, issued to every resident of Japan since 2016. The twelfth digit is a check digit: the first eleven digits are each multiplied by a position-dependent weight (6,5,4,3,2 for positions 1-5; 7,6,5,4,3,2 for positions 6-11), summed, taken Modulus-11, and the remainder subtracted from 11 (remainders of 0 or 1 both yield a check digit of 0).\n  Usage:\n    <span class=\"nihon-kojin-bango-view\" aria-label=\"Individual Number / My Number (マイナンバー)\">value-here</span>\n-->\n\n<span\n  class=\"nihon-kojin-bango-view\"\n  aria-label=\"Individual Number / My Number (マイナンバー)\"\n></span>";

const meta = {
  title: 'Headless/Nihon Kojin Bango View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
