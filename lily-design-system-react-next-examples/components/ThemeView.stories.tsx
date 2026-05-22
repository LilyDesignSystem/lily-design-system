import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ThemeView from './ThemeView';

const meta = {
  title: 'Examples/ThemeView',
  component: ThemeView,
  tags: ['autodocs']
} satisfies Meta<typeof ThemeView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
