import type { Meta, StoryObj } from '@storybook/react-vite';
import AvatarImage from './AvatarImage';

const meta = {
  title: 'Headless/AvatarImage',
  component: AvatarImage,
  tags: ['autodocs']
} satisfies Meta<typeof AvatarImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
