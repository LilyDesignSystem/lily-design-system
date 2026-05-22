import type { Meta, StoryObj } from '@storybook/react-vite';
import Meter from './Meter';

const meta = {
  title: 'Headless/Meter',
  component: Meter,
  tags: ['autodocs']
} satisfies Meta<typeof Meter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
