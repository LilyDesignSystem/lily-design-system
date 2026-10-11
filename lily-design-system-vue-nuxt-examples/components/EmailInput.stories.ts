import type { Meta, StoryObj } from '@storybook/vue3-vite';
import EmailInput from './EmailInput.vue';

const meta = {
  title: 'Headless/EmailInput',
  component: EmailInput,
  tags: ['autodocs']
} satisfies Meta<typeof EmailInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
