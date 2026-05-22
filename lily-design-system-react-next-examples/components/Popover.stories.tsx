import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Popover from './Popover';

const meta = {
  title: 'Examples/Popover',
  component: Popover,
  tags: ['autodocs']
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
