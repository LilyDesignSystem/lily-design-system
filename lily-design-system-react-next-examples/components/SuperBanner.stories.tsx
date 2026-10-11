import type { Meta, StoryObj } from '@storybook/react-vite';
import SuperBanner from './SuperBanner';

const meta = {
  title: 'Headless/SuperBanner',
  component: SuperBanner,
  tags: ['autodocs']
} satisfies Meta<typeof SuperBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
