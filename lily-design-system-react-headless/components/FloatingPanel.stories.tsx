import type { Meta, StoryObj } from '@storybook/react-vite';
import FloatingPanel from './FloatingPanel';

const meta = {
  title: 'Headless/FloatingPanel',
  component: FloatingPanel,
  tags: ['autodocs']
} satisfies Meta<typeof FloatingPanel>;

export default meta;
type Story = StoryObj<typeof FloatingPanel>;

export const Default: Story = {};
