import type { Meta, StoryObj } from '@storybook/react-vite';
import PaddingReset from './PaddingReset';

const meta = {
  title: 'Headless/PaddingReset',
  component: PaddingReset,
  tags: ['autodocs']
} satisfies Meta<typeof PaddingReset>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
