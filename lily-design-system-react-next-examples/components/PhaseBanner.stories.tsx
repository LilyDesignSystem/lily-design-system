import type { Meta, StoryObj } from '@storybook/react-vite';
import PhaseBanner from './PhaseBanner';

const meta = {
  title: 'Headless/PhaseBanner',
  component: PhaseBanner,
  tags: ['autodocs']
} satisfies Meta<typeof PhaseBanner>;

export default meta;
type Story = StoryObj<typeof PhaseBanner>;

export const Default: Story = {};
