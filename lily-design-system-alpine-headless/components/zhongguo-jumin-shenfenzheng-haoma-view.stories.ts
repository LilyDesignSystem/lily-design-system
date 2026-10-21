import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ZhongguoJuminShenfenzhengHaomaView component -->\n<!--\n  Description: a read-only display of China's Resident Identity Card Number\n  HTML tag: <span>\n  CSS class: zhongguo-jumin-shenfenzheng-haoma-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: Eighteen characters (GB 11643): region, date of birth, sequence with sex parity, then an ISO 7064 MOD 11-2 check character (may be X).\n  Usage:\n    <span class=\"zhongguo-jumin-shenfenzheng-haoma-view\" aria-label=\"居民身份证号码 (Jūmín Shēnfènzhèng Hàomǎ)\">value-here</span>\n-->\n\n<span\n  class=\"zhongguo-jumin-shenfenzheng-haoma-view\"\n  aria-label=\"居民身份证号码 (Jūmín Shēnfènzhèng Hàomǎ)\"\n></span>";

const meta = {
  title: 'Headless/Zhongguo Jumin Shenfenzheng Haoma View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
