import type { Meta, StoryObj } from '@storybook/vue3-vite';
import AvatarImage from './AvatarImage.vue';

const meta = {
  title: 'Headless/AvatarImage',
  component: AvatarImage,
  tags: ['autodocs']
} satisfies Meta<typeof AvatarImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
