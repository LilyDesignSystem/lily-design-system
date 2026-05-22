import type { Meta, StoryObj } from '@storybook/vue3-vite';
import BannerBox from './BannerBox.vue';

const meta = {
  title: 'Examples/BannerBox',
  component: BannerBox,
  tags: ['autodocs']
} satisfies Meta<typeof BannerBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
