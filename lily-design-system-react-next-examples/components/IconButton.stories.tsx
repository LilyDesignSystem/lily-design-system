import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import IconButton from './IconButton';

const meta = {
  title: 'Examples/IconButton',
  component: IconButton,
  tags: ['autodocs']
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
