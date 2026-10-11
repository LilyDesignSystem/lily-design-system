import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Form from './Form.vue';

const meta = {
  title: 'Headless/Form',
  component: Form,
  tags: ['autodocs']
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
