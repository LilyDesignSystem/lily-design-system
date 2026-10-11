import type { Meta, StoryObj } from '@storybook/vue3-vite';
import SectionHeading from './SectionHeading.vue';

const meta = {
  title: 'Headless/SectionHeading',
  component: SectionHeading,
  tags: ['autodocs']
} satisfies Meta<typeof SectionHeading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
