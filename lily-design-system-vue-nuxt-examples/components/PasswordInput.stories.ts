import type { Meta, StoryObj } from '@storybook/vue3-vite';
import PasswordInput from './PasswordInput.vue';

const meta = {
  title: 'Examples/PasswordInput',
  component: PasswordInput,
  tags: ['autodocs']
} satisfies Meta<typeof PasswordInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
