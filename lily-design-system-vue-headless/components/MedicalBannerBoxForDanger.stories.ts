import type { Meta, StoryObj } from '@storybook/vue3-vite';
import MedicalBannerBoxForDanger from './MedicalBannerBoxForDanger.vue';

const meta = {
  title: 'Headless/MedicalBannerBoxForDanger',
  component: MedicalBannerBoxForDanger,
  tags: ['autodocs']
} satisfies Meta<typeof MedicalBannerBoxForDanger>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
