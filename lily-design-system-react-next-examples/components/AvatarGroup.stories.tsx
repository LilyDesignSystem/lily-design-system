import type { Meta, StoryObj } from '@storybook/react-vite';
import AvatarGroup from './AvatarGroup';

const meta = {
  title: 'Headless/AvatarGroup',
  component: AvatarGroup,
  tags: ['autodocs']
} satisfies Meta<typeof AvatarGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
