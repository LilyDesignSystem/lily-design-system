import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import MockupTabletPortrait from './MockupTabletPortrait';

const meta = {
  title: 'Examples/MockupTabletPortrait',
  component: MockupTabletPortrait,
  tags: ['autodocs']
} satisfies Meta<typeof MockupTabletPortrait>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
