import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import AlbaCommunityHealthIndexView from './AlbaCommunityHealthIndexView';

const meta = {
  title: 'Examples/AlbaCommunityHealthIndexView',
  component: AlbaCommunityHealthIndexView,
  tags: ['autodocs']
} satisfies Meta<typeof AlbaCommunityHealthIndexView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'AlbaCommunityHealthIndexView' }
};
