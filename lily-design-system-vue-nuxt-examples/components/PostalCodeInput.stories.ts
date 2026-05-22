import type { Meta, StoryObj } from '@storybook/vue3-vite';
import PostalCodeInput from './PostalCodeInput.vue';

const meta = {
  title: 'Examples/PostalCodeInput',
  component: PostalCodeInput,
  tags: ['autodocs']
} satisfies Meta<typeof PostalCodeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
