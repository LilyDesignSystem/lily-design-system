import type { Meta, StoryObj } from '@storybook/vue3-vite';
import TextAreaInput from './TextAreaInput.vue';

const meta = {
  title: 'Headless/TextAreaInput',
  component: TextAreaInput,
  tags: ['autodocs']
} satisfies Meta<typeof TextAreaInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
