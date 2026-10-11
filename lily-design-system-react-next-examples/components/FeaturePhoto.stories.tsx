import type { Meta, StoryObj } from '@storybook/react-vite';
import FeaturePhoto from './FeaturePhoto';

const meta = {
  title: 'Headless/FeaturePhoto',
  component: FeaturePhoto,
  tags: ['autodocs']
} satisfies Meta<typeof FeaturePhoto>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
