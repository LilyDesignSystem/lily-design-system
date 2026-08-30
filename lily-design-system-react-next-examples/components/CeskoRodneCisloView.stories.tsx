import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import CeskoRodneCisloView from './CeskoRodneCisloView';

const meta = {
  title: 'Examples/CeskoRodneCisloView',
  component: CeskoRodneCisloView,
  tags: ['autodocs']
} satisfies Meta<typeof CeskoRodneCisloView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'CeskoRodneCisloView' }
};
