import type { Meta, StoryObj } from '@storybook/vue3-vite';
import CeskoRodneCisloInput from './CeskoRodneCisloInput.vue';

const meta = {
  title: 'Headless/CeskoRodneCisloInput',
  component: CeskoRodneCisloInput,
  tags: ['autodocs']
} satisfies Meta<typeof CeskoRodneCisloInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'CeskoRodneCisloInput' }
};
