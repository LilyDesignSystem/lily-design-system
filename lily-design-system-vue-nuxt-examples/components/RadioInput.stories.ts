import type { Meta, StoryObj } from '@storybook/vue3-vite';
import RadioInput from './RadioInput.vue';

const meta = {
  title: 'Headless/RadioInput',
  component: RadioInput,
  tags: ['autodocs']
} satisfies Meta<typeof RadioInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
