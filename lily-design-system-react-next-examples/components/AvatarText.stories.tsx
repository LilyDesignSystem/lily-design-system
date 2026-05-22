import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import AvatarText from './AvatarText';

const meta = {
  title: 'Examples/AvatarText',
  component: AvatarText,
  tags: ['autodocs']
} satisfies Meta<typeof AvatarText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
