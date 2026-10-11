import type { Meta, StoryObj } from '@storybook/react-vite';
import Sparkline from './Sparkline';

const meta = {
  title: 'Headless/Sparkline',
  component: Sparkline,
  tags: ['autodocs']
} satisfies Meta<typeof Sparkline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
