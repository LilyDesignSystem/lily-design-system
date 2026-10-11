import type { Meta, StoryObj } from '@storybook/vue3-vite';
import TelInput from './TelInput.vue';

const meta = {
  title: 'Headless/TelInput',
  component: TelInput,
  tags: ['autodocs']
} satisfies Meta<typeof TelInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
