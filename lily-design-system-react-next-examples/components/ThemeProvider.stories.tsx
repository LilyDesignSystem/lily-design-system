import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ThemeProvider from './ThemeProvider';

const meta = {
  title: 'Examples/ThemeProvider',
  component: ThemeProvider,
  tags: ['autodocs']
} satisfies Meta<typeof ThemeProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
