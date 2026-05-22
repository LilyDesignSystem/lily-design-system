import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ErrorSummary from './ErrorSummary.vue';

const meta = {
  title: 'Headless/ErrorSummary',
  component: ErrorSummary,
  tags: ['autodocs']
} satisfies Meta<typeof ErrorSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
