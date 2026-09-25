import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="zhongguo-jumin-shenfenzheng-haoma-view"
  aria-label="居民身份证号码 (Jūmín Shēnfènzhèng Hàomǎ)"
>sample-value</span>`;

const meta = {
  title: 'Headless/ZhongguoJuminShenfenzhengHaomaView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
