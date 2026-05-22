import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import SuperBanner from './SuperBanner';

const meta = {
  title: 'Examples/SuperBanner',
  component: SuperBanner,
  tags: ['autodocs']
} satisfies Meta<typeof SuperBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
