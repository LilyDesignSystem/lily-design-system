import type { Meta, StoryObj } from '@storybook/react-vite';
import SlovenskoRodneCisloView from './SlovenskoRodneCisloView';

const meta = {
  title: 'Headless/SlovenskoRodneCisloView',
  component: SlovenskoRodneCisloView,
  tags: ['autodocs']
} satisfies Meta<typeof SlovenskoRodneCisloView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'SlovenskoRodneCisloView' }
};
