import type { Meta, StoryObj } from '@storybook/react-vite';
import FeatureCard from './FeatureCard';

const meta = {
  title: 'Headless/FeatureCard',
  component: FeatureCard,
  tags: ['autodocs']
} satisfies Meta<typeof FeatureCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
