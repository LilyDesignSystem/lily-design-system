import type { Meta, StoryObj } from '@storybook/react-vite';
import RossiyaSnilsView from './RossiyaSnilsView';

const meta = {
  title: 'Headless/RossiyaSnilsView',
  component: RossiyaSnilsView,
  tags: ['autodocs']
} satisfies Meta<typeof RossiyaSnilsView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'RossiyaSnilsView' }
};
