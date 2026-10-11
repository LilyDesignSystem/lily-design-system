import type { Meta, StoryObj } from '@storybook/react-vite';
import OverlayContainer from './OverlayContainer';

const meta = {
  title: 'Headless/OverlayContainer',
  component: OverlayContainer,
  tags: ['autodocs']
} satisfies Meta<typeof OverlayContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
