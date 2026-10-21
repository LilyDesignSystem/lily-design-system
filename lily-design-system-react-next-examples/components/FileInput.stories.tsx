import type { Meta, StoryObj } from '@storybook/react-vite';
import FileInput from './FileInput';

const meta = {
  title: 'Headless/FileInput',
  component: FileInput,
  tags: ['autodocs']
} satisfies Meta<typeof FileInput>;

export default meta;
type Story = StoryObj<typeof FileInput>;

export const Default: Story = {};
