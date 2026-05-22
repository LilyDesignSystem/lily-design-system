import type { Meta, StoryObj } from '@storybook/react-vite';
import MockupTabletLandscape from './MockupTabletLandscape';

const meta = {
  title: 'Headless/MockupTabletLandscape',
  component: MockupTabletLandscape,
  tags: ['autodocs']
} satisfies Meta<typeof MockupTabletLandscape>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
