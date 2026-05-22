import type { Meta, StoryObj } from '@storybook/vue3-vite';
import FeatureCard from './FeatureCard.vue';

const meta = {
  title: 'Examples/FeatureCard',
  component: FeatureCard,
  tags: ['autodocs']
} satisfies Meta<typeof FeatureCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
