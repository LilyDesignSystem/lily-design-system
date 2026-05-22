import type { Meta, StoryObj } from '@storybook/react-vite';
import MedicalBannerBoxForDanger from './MedicalBannerBoxForDanger';

const meta = {
  title: 'Headless/MedicalBannerBoxForDanger',
  component: MedicalBannerBoxForDanger,
  tags: ['autodocs']
} satisfies Meta<typeof MedicalBannerBoxForDanger>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
