import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import NederlandBurgerserviceNummerInput from './NederlandBurgerserviceNummerInput';

const meta = {
  title: 'Examples/NederlandBurgerserviceNummerInput',
  component: NederlandBurgerserviceNummerInput,
  tags: ['autodocs']
} satisfies Meta<typeof NederlandBurgerserviceNummerInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'NederlandBurgerserviceNummerInput' }
};
