import type { Meta, StoryObj } from '@storybook/vue3-vite';
import FeaturePhoto from './FeaturePhoto.vue';

const meta = {
  title: 'Examples/FeaturePhoto',
  component: FeaturePhoto,
  tags: ['autodocs']
} satisfies Meta<typeof FeaturePhoto>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
