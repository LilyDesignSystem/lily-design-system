import type { Meta, StoryObj } from '@storybook/vue3-vite';
import MedicalBannerBox from './MedicalBannerBox.vue';

const meta = {
  title: 'Headless/MedicalBannerBox',
  component: MedicalBannerBox,
  tags: ['autodocs']
} satisfies Meta<typeof MedicalBannerBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
