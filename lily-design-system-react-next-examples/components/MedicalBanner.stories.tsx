import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import MedicalBanner from './MedicalBanner';

const meta = {
  title: 'Examples/MedicalBanner',
  component: MedicalBanner,
  tags: ['autodocs']
} satisfies Meta<typeof MedicalBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
