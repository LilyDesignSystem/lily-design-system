import type { Meta, StoryObj } from '@storybook/vue3-vite';
import AvatarText from './AvatarText.vue';

const meta = {
  title: 'Headless/AvatarText',
  component: AvatarText,
  tags: ['autodocs']
} satisfies Meta<typeof AvatarText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
