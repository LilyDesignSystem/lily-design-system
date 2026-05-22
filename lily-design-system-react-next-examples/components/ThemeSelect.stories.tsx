import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ThemeSelect from './ThemeSelect';

const meta = {
  title: 'Examples/ThemeSelect',
  component: ThemeSelect,
  tags: ['autodocs']
} satisfies Meta<typeof ThemeSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
