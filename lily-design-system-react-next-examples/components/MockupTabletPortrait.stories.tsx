import type { Meta, StoryObj } from '@storybook/react-vite';
import MockupTabletPortrait from './MockupTabletPortrait';

const meta = {
  title: 'Headless/MockupTabletPortrait',
  component: MockupTabletPortrait,
  tags: ['autodocs']
} satisfies Meta<typeof MockupTabletPortrait>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
