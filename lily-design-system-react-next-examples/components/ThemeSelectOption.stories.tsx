import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ThemeSelectOption from './ThemeSelectOption';

const meta = {
  title: 'Examples/ThemeSelectOption',
  component: ThemeSelectOption,
  tags: ['autodocs']
} satisfies Meta<typeof ThemeSelectOption>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
