import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="zhongguo-jumin-shenfenzheng-haoma-input"
  type="text"
  autocomplete="off"
  spellcheck="false"
  aria-label="居民身份证号码 (Jūmín Shēnfènzhèng Hàomǎ)">`;

const meta = {
  title: 'Headless/ZhongguoJuminShenfenzhengHaomaInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
