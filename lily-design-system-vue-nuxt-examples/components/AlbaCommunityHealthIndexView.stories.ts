import type { Meta, StoryObj } from '@storybook/vue3-vite';
import AlbaCommunityHealthIndexView from './AlbaCommunityHealthIndexView.vue';

const meta = {
  title: 'Headless/AlbaCommunityHealthIndexView',
  component: AlbaCommunityHealthIndexView,
  tags: ['autodocs']
} satisfies Meta<typeof AlbaCommunityHealthIndexView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'AlbaCommunityHealthIndexView' }
};
