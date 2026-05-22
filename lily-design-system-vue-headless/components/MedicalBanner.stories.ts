import type { Meta, StoryObj } from '@storybook/vue3-vite';
import MedicalBanner from './MedicalBanner.vue';

const meta = {
  title: 'Headless/MedicalBanner',
  component: MedicalBanner,
  tags: ['autodocs']
} satisfies Meta<typeof MedicalBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
