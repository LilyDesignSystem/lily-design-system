import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ResetInput from './ResetInput.vue';

const meta = {
  title: 'Headless/ResetInput',
  component: ResetInput,
  tags: ['autodocs']
} satisfies Meta<typeof ResetInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
