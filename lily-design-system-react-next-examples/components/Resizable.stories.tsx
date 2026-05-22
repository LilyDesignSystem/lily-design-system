import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Resizable from './Resizable';

const meta = {
  title: 'Examples/Resizable',
  component: Resizable,
  tags: ['autodocs']
} satisfies Meta<typeof Resizable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
