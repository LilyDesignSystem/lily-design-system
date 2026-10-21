import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"zhongguo-jumin-shenfenzheng-haoma-view\"\n  aria-label=\"居民身份证号码 (Jūmín Shēnfènzhèng Hàomǎ)\"\n></span>";

const meta = {
  title: 'Headless/Zhongguo Jumin Shenfenzheng Haoma View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
