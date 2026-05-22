import type { Meta, StoryObj } from '@storybook/react-vite';
import ThemeView from './ThemeView';

const meta = {
  title: 'Headless/ThemeView',
  component: ThemeView,
  tags: ['autodocs']
} satisfies Meta<typeof ThemeView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
