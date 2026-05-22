import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import FeatureCard from './FeatureCard';

const meta = {
  title: 'Examples/FeatureCard',
  component: FeatureCard,
  tags: ['autodocs']
} satisfies Meta<typeof FeatureCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
