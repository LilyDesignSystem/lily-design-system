import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="zhongguo-jumin-shenfenzheng-haoma-input"
  type="text"
  aria-label="居民身份证号码 (Jūmín Shēnfènzhèng Hàomǎ)"
  autocomplete="off"
>`;

const meta = {
  title: 'Headless/ZhongguoJuminShenfenzhengHaomaInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
