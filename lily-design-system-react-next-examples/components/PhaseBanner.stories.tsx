import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import PhaseBanner from './PhaseBanner';

const meta = {
  title: 'Examples/PhaseBanner',
  component: PhaseBanner,
  tags: ['autodocs']
} satisfies Meta<typeof PhaseBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
