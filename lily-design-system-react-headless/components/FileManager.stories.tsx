import type { Meta, StoryObj } from '@storybook/react-vite';
import FileManager from './FileManager';

const meta = {
  title: 'Headless/FileManager',
  component: FileManager,
  tags: ['autodocs']
} satisfies Meta<typeof FileManager>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
