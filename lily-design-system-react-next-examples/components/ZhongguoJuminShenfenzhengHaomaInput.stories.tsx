import type { Meta, StoryObj } from '@storybook/react-vite';
import ZhongguoJuminShenfenzhengHaomaInput from './ZhongguoJuminShenfenzhengHaomaInput';

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
