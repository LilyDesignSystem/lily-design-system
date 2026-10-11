import type { Meta, StoryObj } from '@storybook/react-vite';
import YisraelTeudatZehutInput from './YisraelTeudatZehutInput';

const meta = {
  title: 'Headless/YisraelTeudatZehutInput',
  component: YisraelTeudatZehutInput,
  tags: ['autodocs']
} satisfies Meta<typeof YisraelTeudatZehutInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'YisraelTeudatZehutInput' }
};
