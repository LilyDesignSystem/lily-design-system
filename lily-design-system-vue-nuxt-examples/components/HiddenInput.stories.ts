import type { Meta, StoryObj } from '@storybook/vue3-vite';
import HiddenInput from './HiddenInput.vue';

const meta = {
  title: 'Headless/HiddenInput',
  component: HiddenInput,
  tags: ['autodocs']
} satisfies Meta<typeof HiddenInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
