import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import MedicalBannerBox from './MedicalBannerBox';

const meta = {
  title: 'Examples/MedicalBannerBox',
  component: MedicalBannerBox,
  tags: ['autodocs']
} satisfies Meta<typeof MedicalBannerBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
