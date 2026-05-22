import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import FileManager from './FileManager';

const meta = {
  title: 'Examples/FileManager',
  component: FileManager,
  tags: ['autodocs']
} satisfies Meta<typeof FileManager>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
