import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- NihonKojinBangoInput component -->\n<!--\n  Description: an input for entering Japan's Individual Number / My Number (マイナンバー)\n  HTML tag: <input>\n  CSS class: nihon-kojin-bango-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: Twelve digits, issued to every resident of Japan since 2016. The twelfth digit is a check digit: the first eleven digits are each multiplied by a position-dependent weight (6,5,4,3,2 for positions 1-5; 7,6,5,4,3,2 for positions 6-11), summed, taken Modulus-11, and the remainder subtracted from 11 (remainders of 0 or 1 both yield a check digit of 0).\n  Usage:\n    <input class=\"nihon-kojin-bango-input\" type=\"text\" aria-label=\"Individual Number / My Number (マイナンバー)\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"nihon-kojin-bango-input\"\n  type=\"text\"\n  aria-label=\"Individual Number / My Number (マイナンバー)\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Nihon Kojin Bango Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
