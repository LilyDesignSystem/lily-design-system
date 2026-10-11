import type { Meta, StoryObj } from '@storybook/react-vite';
import ThemeProvider from './ThemeProvider';

const meta = {
  title: 'Headless/ThemeProvider',
  component: ThemeProvider,
  tags: ['autodocs']
} satisfies Meta<typeof ThemeProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
