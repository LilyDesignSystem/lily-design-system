import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import TextInput from './TextInput';

const meta = {
  title: 'Examples/TextInput',
  component: TextInput,
  tags: ['autodocs']
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
