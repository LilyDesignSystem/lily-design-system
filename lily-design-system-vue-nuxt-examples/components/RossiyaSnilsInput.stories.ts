import type { Meta, StoryObj } from '@storybook/vue3-vite';
import RossiyaSnilsInput from './RossiyaSnilsInput.vue';

const meta = {
  title: 'Headless/RossiyaSnilsInput',
  component: RossiyaSnilsInput,
  tags: ['autodocs']
} satisfies Meta<typeof RossiyaSnilsInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'RossiyaSnilsInput' }
};
