import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import AvatarGroup from './AvatarGroup';

const meta = {
  title: 'Examples/AvatarGroup',
  component: AvatarGroup,
  tags: ['autodocs']
} satisfies Meta<typeof AvatarGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
