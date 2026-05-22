import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import SplitButton from './SplitButton';

const meta = {
  title: 'Examples/SplitButton',
  component: SplitButton,
  tags: ['autodocs']
} satisfies Meta<typeof SplitButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
