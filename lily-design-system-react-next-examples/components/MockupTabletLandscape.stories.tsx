import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import MockupTabletLandscape from './MockupTabletLandscape';

const meta = {
  title: 'Examples/MockupTabletLandscape',
  component: MockupTabletLandscape,
  tags: ['autodocs']
} satisfies Meta<typeof MockupTabletLandscape>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
