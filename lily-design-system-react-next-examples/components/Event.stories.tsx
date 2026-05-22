import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Event from './Event';

const meta = {
  title: 'Examples/Event',
  component: Event,
  tags: ['autodocs']
} satisfies Meta<typeof Event>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
