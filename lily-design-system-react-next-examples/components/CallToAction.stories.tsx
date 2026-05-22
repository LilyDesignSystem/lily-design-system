import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import CallToAction from './CallToAction';

const meta = {
  title: 'Examples/CallToAction',
  component: CallToAction,
  tags: ['autodocs']
} satisfies Meta<typeof CallToAction>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
