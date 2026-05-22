import type { Meta, StoryObj } from '@storybook/vue3-vite';
import SearchInput from './SearchInput.vue';

const meta = {
  title: 'Headless/SearchInput',
  component: SearchInput,
  tags: ['autodocs']
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
