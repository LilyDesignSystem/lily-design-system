import type { Meta, StoryObj } from '@storybook/vue3-vite';
import RangeInput from './RangeInput.vue';

const meta = {
  title: 'Examples/RangeInput',
  component: RangeInput,
  tags: ['autodocs']
} satisfies Meta<typeof RangeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
