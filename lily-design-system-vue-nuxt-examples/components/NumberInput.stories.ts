import type { Meta, StoryObj } from '@storybook/vue3-vite';
import NumberInput from './NumberInput.vue';

const meta = {
  title: 'Headless/NumberInput',
  component: NumberInput,
  tags: ['autodocs']
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
