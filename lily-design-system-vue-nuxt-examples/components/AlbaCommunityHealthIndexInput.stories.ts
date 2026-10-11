import type { Meta, StoryObj } from '@storybook/vue3-vite';
import AlbaCommunityHealthIndexInput from './AlbaCommunityHealthIndexInput.vue';

const meta = {
  title: 'Headless/AlbaCommunityHealthIndexInput',
  component: AlbaCommunityHealthIndexInput,
  tags: ['autodocs']
} satisfies Meta<typeof AlbaCommunityHealthIndexInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'AlbaCommunityHealthIndexInput' }
};
