import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import MedicalBannerBoxForDanger from './MedicalBannerBoxForDanger';

const meta = {
  title: 'Examples/MedicalBannerBoxForDanger',
  component: MedicalBannerBoxForDanger,
  tags: ['autodocs']
} satisfies Meta<typeof MedicalBannerBoxForDanger>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
