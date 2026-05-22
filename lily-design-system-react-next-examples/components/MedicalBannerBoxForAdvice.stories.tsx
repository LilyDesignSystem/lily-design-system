import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import MedicalBannerBoxForAdvice from './MedicalBannerBoxForAdvice';

const meta = {
  title: 'Examples/MedicalBannerBoxForAdvice',
  component: MedicalBannerBoxForAdvice,
  tags: ['autodocs']
} satisfies Meta<typeof MedicalBannerBoxForAdvice>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
