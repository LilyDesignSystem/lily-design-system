import type { Meta, StoryObj } from '@storybook/vue3-vite';
import NederlandBurgerserviceNummerInput from './NederlandBurgerserviceNummerInput.vue';

const meta = {
  title: 'Headless/NederlandBurgerserviceNummerInput',
  component: NederlandBurgerserviceNummerInput,
  tags: ['autodocs']
} satisfies Meta<typeof NederlandBurgerserviceNummerInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'NederlandBurgerserviceNummerInput' }
};
