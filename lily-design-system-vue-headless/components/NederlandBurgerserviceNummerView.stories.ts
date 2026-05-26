import type { Meta, StoryObj } from '@storybook/vue3-vite';
import NederlandBurgerserviceNummerView from './NederlandBurgerserviceNummerView.vue';

const meta = {
  title: 'Headless/NederlandBurgerserviceNummerView',
  component: NederlandBurgerserviceNummerView,
  tags: ['autodocs']
} satisfies Meta<typeof NederlandBurgerserviceNummerView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'NederlandBurgerserviceNummerView' }
};
