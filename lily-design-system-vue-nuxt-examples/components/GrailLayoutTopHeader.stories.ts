import type { Meta, StoryObj } from '@storybook/vue3-vite';
import GrailLayoutTopHeader from './GrailLayoutTopHeader.vue';

const meta = {
  title: 'Headless/GrailLayoutTopHeader',
  component: GrailLayoutTopHeader,
  tags: ['autodocs']
} satisfies Meta<typeof GrailLayoutTopHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
