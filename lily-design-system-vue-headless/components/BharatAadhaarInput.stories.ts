import type { Meta, StoryObj } from '@storybook/vue3-vite';
import BharatAadhaarInput from './BharatAadhaarInput.vue';

const meta = {
  title: 'Headless/BharatAadhaarInput',
  component: BharatAadhaarInput,
  tags: ['autodocs']
} satisfies Meta<typeof BharatAadhaarInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'BharatAadhaarInput' }
};
