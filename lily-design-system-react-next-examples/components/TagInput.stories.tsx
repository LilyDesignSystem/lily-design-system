import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import TagInput from './TagInput';

const meta = {
  title: 'Examples/TagInput',
  component: TagInput,
  tags: ['autodocs']
} satisfies Meta<typeof TagInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
