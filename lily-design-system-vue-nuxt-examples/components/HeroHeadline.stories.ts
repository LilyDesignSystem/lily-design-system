import type { Meta, StoryObj } from '@storybook/vue3-vite';
import HeroHeadline from './HeroHeadline.vue';

const meta = {
  title: 'Examples/HeroHeadline',
  component: HeroHeadline,
  tags: ['autodocs']
} satisfies Meta<typeof HeroHeadline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
