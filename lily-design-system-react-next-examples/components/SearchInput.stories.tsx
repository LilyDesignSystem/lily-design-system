import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import SearchInput from './SearchInput';

const meta = {
  title: 'Examples/SearchInput',
  component: SearchInput,
  tags: ['autodocs']
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
