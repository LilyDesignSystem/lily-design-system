import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import AlbaCommunityHealthIndexInput from './AlbaCommunityHealthIndexInput';

const meta = {
  title: 'Examples/AlbaCommunityHealthIndexInput',
  component: AlbaCommunityHealthIndexInput,
  tags: ['autodocs']
} satisfies Meta<typeof AlbaCommunityHealthIndexInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'AlbaCommunityHealthIndexInput' }
};
