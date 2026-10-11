import type { Meta, StoryObj } from '@storybook/react-vite';
import SearchInput from './SearchInput';

const meta = {
  title: 'Headless/SearchInput',
  component: SearchInput,
  tags: ['autodocs']
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
