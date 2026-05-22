import type { Meta, StoryObj } from '@storybook/vue3-vite';
import GrailLayoutLeftAside from './GrailLayoutLeftAside.vue';

const meta = {
  title: 'Headless/GrailLayoutLeftAside',
  component: GrailLayoutLeftAside,
  tags: ['autodocs']
} satisfies Meta<typeof GrailLayoutLeftAside>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
