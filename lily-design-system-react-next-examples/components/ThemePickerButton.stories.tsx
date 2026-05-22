import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ThemePickerButton from './ThemePickerButton';

const meta = {
  title: 'Examples/ThemePickerButton',
  component: ThemePickerButton,
  tags: ['autodocs']
} satisfies Meta<typeof ThemePickerButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
