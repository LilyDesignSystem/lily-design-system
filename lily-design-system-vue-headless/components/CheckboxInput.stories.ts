import type { Meta, StoryObj } from '@storybook/vue3-vite';
import CheckboxInput from './CheckboxInput.vue';

const meta = {
  title: 'Headless/CheckboxInput',
  component: CheckboxInput,
  tags: ['autodocs']
} satisfies Meta<typeof CheckboxInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
