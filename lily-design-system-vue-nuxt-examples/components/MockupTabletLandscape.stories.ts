import type { Meta, StoryObj } from '@storybook/vue3-vite';
import MockupTabletLandscape from './MockupTabletLandscape.vue';

const meta = {
  title: 'Examples/MockupTabletLandscape',
  component: MockupTabletLandscape,
  tags: ['autodocs']
} satisfies Meta<typeof MockupTabletLandscape>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
