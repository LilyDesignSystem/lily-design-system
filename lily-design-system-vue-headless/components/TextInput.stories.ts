import type { Meta, StoryObj } from '@storybook/vue3-vite';
import TextInput from './TextInput.vue';

const meta = {
  title: 'Headless/TextInput',
  component: TextInput,
  tags: ['autodocs']
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
