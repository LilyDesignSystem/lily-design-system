import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ZhongguoJuminShenfenzhengHaomaView from './ZhongguoJuminShenfenzhengHaomaView.vue';

const meta = {
  title: 'Headless/ZhongguoJuminShenfenzhengHaomaView',
  component: ZhongguoJuminShenfenzhengHaomaView,
  tags: ['autodocs']
} satisfies Meta<typeof ZhongguoJuminShenfenzhengHaomaView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'ZhongguoJuminShenfenzhengHaomaView' }
};
