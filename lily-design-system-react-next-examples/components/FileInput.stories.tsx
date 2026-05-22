import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import FileInput from './FileInput';

const meta = {
  title: 'Examples/FileInput',
  component: FileInput,
  tags: ['autodocs']
} satisfies Meta<typeof FileInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
