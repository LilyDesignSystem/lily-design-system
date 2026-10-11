import type { Meta, StoryObj } from '@storybook/vue3-vite';
import FileInput from './FileInput.vue';

const meta = {
  title: 'Headless/FileInput',
  component: FileInput,
  tags: ['autodocs']
} satisfies Meta<typeof FileInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
