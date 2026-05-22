import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import OverlayContainer from './OverlayContainer';

const meta = {
  title: 'Examples/OverlayContainer',
  component: OverlayContainer,
  tags: ['autodocs']
} satisfies Meta<typeof OverlayContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
