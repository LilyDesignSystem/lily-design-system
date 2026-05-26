import type { Meta, StoryObj } from '@storybook/react-vite';
import CeskoRodneCisloView from './CeskoRodneCisloView';

const meta = {
  title: 'Headless/CeskoRodneCisloView',
  component: CeskoRodneCisloView,
  tags: ['autodocs']
} satisfies Meta<typeof CeskoRodneCisloView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'CeskoRodneCisloView' }
};
