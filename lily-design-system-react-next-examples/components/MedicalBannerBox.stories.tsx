import type { Meta, StoryObj } from '@storybook/react-vite';
import MedicalBannerBox from './MedicalBannerBox';

const meta = {
  title: 'Headless/MedicalBannerBox',
  component: MedicalBannerBox,
  tags: ['autodocs']
} satisfies Meta<typeof MedicalBannerBox>;

export default meta;
type Story = StoryObj<typeof MedicalBannerBox>;

export const Default: Story = {};
