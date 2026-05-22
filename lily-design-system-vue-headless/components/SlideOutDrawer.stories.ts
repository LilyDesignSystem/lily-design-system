import type { Meta, StoryObj } from '@storybook/vue3-vite';
import SlideOutDrawer from './SlideOutDrawer.vue';

const meta = {
  title: 'Headless/SlideOutDrawer',
  component: SlideOutDrawer,
  tags: ['autodocs']
} satisfies Meta<typeof SlideOutDrawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
