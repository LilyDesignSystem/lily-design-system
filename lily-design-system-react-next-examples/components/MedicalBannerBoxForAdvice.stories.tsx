import type { Meta, StoryObj } from '@storybook/react-vite';
import MedicalBannerBoxForAdvice from './MedicalBannerBoxForAdvice';

const meta = {
  title: 'Headless/MedicalBannerBoxForAdvice',
  component: MedicalBannerBoxForAdvice,
  tags: ['autodocs']
} satisfies Meta<typeof MedicalBannerBoxForAdvice>;

export default meta;
type Story = StoryObj<typeof MedicalBannerBoxForAdvice>;

export const Default: Story = {};
