import type { Meta, StoryObj } from '@storybook/react-vite';
import Sonner from './Sonner';

const meta = {
  title: 'Headless/Sonner',
  component: Sonner,
  tags: ['autodocs']
} satisfies Meta<typeof Sonner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
