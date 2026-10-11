import type { Meta, StoryObj } from '@storybook/react-vite';
import IslandKennitalaView from './IslandKennitalaView';

const meta = {
  title: 'Headless/IslandKennitalaView',
  component: IslandKennitalaView,
  tags: ['autodocs']
} satisfies Meta<typeof IslandKennitalaView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'IslandKennitalaView' }
};
