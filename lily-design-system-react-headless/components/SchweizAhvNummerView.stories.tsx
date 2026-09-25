import type { Meta, StoryObj } from '@storybook/react-vite';
import SchweizAhvNummerView from './SchweizAhvNummerView';

const meta = {
  title: 'Headless/SchweizAhvNummerView',
  component: SchweizAhvNummerView,
  tags: ['autodocs']
} satisfies Meta<typeof SchweizAhvNummerView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'SchweizAhvNummerView' }
};
