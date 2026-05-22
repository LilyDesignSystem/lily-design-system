import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Meter from './Meter';

const meta = {
  title: 'Examples/Meter',
  component: Meter,
  tags: ['autodocs']
} satisfies Meta<typeof Meter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
