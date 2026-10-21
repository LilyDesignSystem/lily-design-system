import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"zhongguo-jumin-shenfenzheng-haoma-input\"\n  type=\"text\"\n  aria-label=\"居民身份证号码 (Jūmín Shēnfènzhèng Hàomǎ)\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Zhongguo Jumin Shenfenzheng Haoma Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
