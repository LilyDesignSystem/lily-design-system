import type { Meta, StoryObj } from '@storybook/react-vite';
import ZhongguoJuminShenfenzhengHaomaView from './ZhongguoJuminShenfenzhengHaomaView';

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
