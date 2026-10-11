import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ZhongguoJuminShenfenzhengHaomaInput from './ZhongguoJuminShenfenzhengHaomaInput.vue';

const meta = {
  title: 'Headless/ZhongguoJuminShenfenzhengHaomaInput',
  component: ZhongguoJuminShenfenzhengHaomaInput,
  tags: ['autodocs']
} satisfies Meta<typeof ZhongguoJuminShenfenzhengHaomaInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'ZhongguoJuminShenfenzhengHaomaInput' }
};
