import type { Meta, StoryObj } from '@storybook/vue3-vite';
import SlovenijaEmsoInput from './SlovenijaEmsoInput.vue';

const meta = {
  title: 'Headless/SlovenijaEmsoInput',
  component: SlovenijaEmsoInput,
  tags: ['autodocs']
} satisfies Meta<typeof SlovenijaEmsoInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'SlovenijaEmsoInput' }
};
