import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import AvatarImage from './AvatarImage';

const meta = {
  title: 'Examples/AvatarImage',
  component: AvatarImage,
  tags: ['autodocs']
} satisfies Meta<typeof AvatarImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
