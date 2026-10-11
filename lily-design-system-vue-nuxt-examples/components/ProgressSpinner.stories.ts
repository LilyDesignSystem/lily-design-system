import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ProgressSpinner from './ProgressSpinner.vue';

const meta = {
  title: 'Headless/ProgressSpinner',
  component: ProgressSpinner,
  tags: ['autodocs']
} satisfies Meta<typeof ProgressSpinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
