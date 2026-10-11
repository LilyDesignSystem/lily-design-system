import type { Meta, StoryObj } from '@storybook/vue3-vite';
import PhaseBanner from './PhaseBanner.vue';

const meta = {
  title: 'Headless/PhaseBanner',
  component: PhaseBanner,
  tags: ['autodocs']
} satisfies Meta<typeof PhaseBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
