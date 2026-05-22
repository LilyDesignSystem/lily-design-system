import type { Meta, StoryObj } from '@storybook/react-vite';
import CallToAction from './CallToAction';

const meta = {
  title: 'Headless/CallToAction',
  component: CallToAction,
  tags: ['autodocs']
} satisfies Meta<typeof CallToAction>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
