import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import SlovenskoRodneCisloView from './SlovenskoRodneCisloView';

const meta = {
  title: 'Examples/SlovenskoRodneCisloView',
  component: SlovenskoRodneCisloView,
  tags: ['autodocs']
} satisfies Meta<typeof SlovenskoRodneCisloView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'SlovenskoRodneCisloView' }
};
