import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import MockupWatch from './MockupWatch';

const meta = {
  title: 'Examples/MockupWatch',
  component: MockupWatch,
  tags: ['autodocs']
} satisfies Meta<typeof MockupWatch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
