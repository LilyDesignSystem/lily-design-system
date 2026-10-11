import type { Meta, StoryObj } from '@storybook/vue3-vite';
import StickyPromoBanner from './StickyPromoBanner.vue';

const meta = {
  title: 'Headless/StickyPromoBanner',
  component: StickyPromoBanner,
  tags: ['autodocs']
} satisfies Meta<typeof StickyPromoBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
