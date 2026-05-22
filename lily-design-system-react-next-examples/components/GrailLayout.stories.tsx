import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import GrailLayout from './GrailLayout';

const meta = {
  title: 'Examples/GrailLayout',
  component: GrailLayout,
  tags: ['autodocs']
} satisfies Meta<typeof GrailLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
