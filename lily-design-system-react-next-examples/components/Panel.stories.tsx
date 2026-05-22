import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Panel from './Panel';

const meta = {
  title: 'Examples/Panel',
  component: Panel,
  tags: ['autodocs']
} satisfies Meta<typeof Panel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
