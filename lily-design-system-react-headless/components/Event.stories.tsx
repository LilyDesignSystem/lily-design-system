import type { Meta, StoryObj } from '@storybook/react-vite';
import Event from './Event';

const meta = {
  title: 'Headless/Event',
  component: Event,
  tags: ['autodocs']
} satisfies Meta<typeof Event>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
