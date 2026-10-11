import type { Meta, StoryObj } from '@storybook/vue3-vite';
import TagInput from './TagInput.vue';

const meta = {
  title: 'Headless/TagInput',
  component: TagInput,
  tags: ['autodocs']
} satisfies Meta<typeof TagInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
