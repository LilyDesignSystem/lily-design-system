import type { Meta, StoryObj } from '@storybook/react-vite';
import ThemeSelectButton from './ThemeSelectButton';

const meta = {
  title: 'Headless/ThemeSelectButton',
  component: ThemeSelectButton,
  tags: ['autodocs']
} satisfies Meta<typeof ThemeSelectButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
