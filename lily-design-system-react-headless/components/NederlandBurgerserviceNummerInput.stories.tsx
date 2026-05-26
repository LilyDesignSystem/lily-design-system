import type { Meta, StoryObj } from '@storybook/react-vite';
import NederlandBurgerserviceNummerInput from './NederlandBurgerserviceNummerInput';

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
