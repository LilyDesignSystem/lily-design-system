import type { Meta, StoryObj } from '@storybook/vue3-vite';
import GrailLayout from './GrailLayout.vue';

const meta = {
  title: 'Headless/GrailLayout',
  component: GrailLayout,
  tags: ['autodocs']
} satisfies Meta<typeof GrailLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
