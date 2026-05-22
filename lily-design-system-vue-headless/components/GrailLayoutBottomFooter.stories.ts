import type { Meta, StoryObj } from '@storybook/vue3-vite';
import GrailLayoutBottomFooter from './GrailLayoutBottomFooter.vue';

const meta = {
  title: 'Headless/GrailLayoutBottomFooter',
  component: GrailLayoutBottomFooter,
  tags: ['autodocs']
} satisfies Meta<typeof GrailLayoutBottomFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
