import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import SlovenijaEmsoView from './SlovenijaEmsoView';

const meta = {
  title: 'Examples/SlovenijaEmsoView',
  component: SlovenijaEmsoView,
  tags: ['autodocs']
} satisfies Meta<typeof SlovenijaEmsoView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'SlovenijaEmsoView' }
};
