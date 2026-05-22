import type { Meta, StoryObj } from '@storybook/vue3-vite';
import AvatarGroup from './AvatarGroup.vue';

const meta = {
  title: 'Headless/AvatarGroup',
  component: AvatarGroup,
  tags: ['autodocs']
} satisfies Meta<typeof AvatarGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
