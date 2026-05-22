import type { Meta, StoryObj } from '@storybook/vue3-vite';
import AddressInput from './AddressInput.vue';

const meta = {
  title: 'Headless/AddressInput',
  component: AddressInput,
  tags: ['autodocs']
} satisfies Meta<typeof AddressInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
