import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ZhongguoJuminShenfenzhengHaomaInput component -->\n<!--\n  Description: an input for entering China's Resident Identity Card Number\n  HTML tag: <input>\n  CSS class: zhongguo-jumin-shenfenzheng-haoma-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: Eighteen characters (GB 11643): region, date of birth, sequence with sex parity, then an ISO 7064 MOD 11-2 check character (may be X).\n  Usage:\n    <input class=\"zhongguo-jumin-shenfenzheng-haoma-input\" type=\"text\" aria-label=\"居民身份证号码 (Jūmín Shēnfènzhèng Hàomǎ)\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"zhongguo-jumin-shenfenzheng-haoma-input\"\n  type=\"text\"\n  aria-label=\"居民身份证号码 (Jūmín Shēnfènzhèng Hàomǎ)\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Zhongguo Jumin Shenfenzheng Haoma Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
