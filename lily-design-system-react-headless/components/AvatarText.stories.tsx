import type { Meta, StoryObj } from '@storybook/react-vite';
import AvatarText from './AvatarText';

const meta = {
  title: 'Headless/AvatarText',
  component: AvatarText,
  tags: ['autodocs']
} satisfies Meta<typeof AvatarText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
