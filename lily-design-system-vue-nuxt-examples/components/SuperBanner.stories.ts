import type { Meta, StoryObj } from '@storybook/vue3-vite';
import SuperBanner from './SuperBanner.vue';

const meta = {
  title: 'Headless/SuperBanner',
  component: SuperBanner,
  tags: ['autodocs']
} satisfies Meta<typeof SuperBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
