import type { Meta, StoryObj } from '@storybook/react-vite';
import SuperBanner from './SuperBanner';

const meta = {
  title: 'Headless/SuperBanner',
  component: SuperBanner,
  tags: ['autodocs']
} satisfies Meta<typeof SuperBanner>;

export default meta;
type Story = StoryObj<typeof SuperBanner>;

export const Default: Story = {};
