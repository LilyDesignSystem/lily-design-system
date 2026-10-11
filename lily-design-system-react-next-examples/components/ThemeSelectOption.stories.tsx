import type { Meta, StoryObj } from '@storybook/react-vite';
import ThemeSelectOption from './ThemeSelectOption';

const meta = {
  title: 'Headless/ThemeSelectOption',
  component: ThemeSelectOption,
  tags: ['autodocs']
} satisfies Meta<typeof ThemeSelectOption>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
