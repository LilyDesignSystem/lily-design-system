import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import FeaturePhoto from './FeaturePhoto';

const meta = {
  title: 'Examples/FeaturePhoto',
  component: FeaturePhoto,
  tags: ['autodocs']
} satisfies Meta<typeof FeaturePhoto>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
