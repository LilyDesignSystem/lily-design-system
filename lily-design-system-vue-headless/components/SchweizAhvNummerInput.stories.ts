import type { Meta, StoryObj } from '@storybook/vue3-vite';
import SchweizAhvNummerInput from './SchweizAhvNummerInput.vue';

const meta = {
  title: 'Headless/SchweizAhvNummerInput',
  component: SchweizAhvNummerInput,
  tags: ['autodocs']
} satisfies Meta<typeof SchweizAhvNummerInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'SchweizAhvNummerInput' }
};
