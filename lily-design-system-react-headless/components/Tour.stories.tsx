import type { Meta, StoryObj } from '@storybook/react-vite';
import Tour from './Tour';

const meta = {
  title: 'Headless/Tour',
  component: Tour,
  tags: ['autodocs']
} satisfies Meta<typeof Tour>;

export default meta;
type Story = StoryObj<typeof Tour>;

export const Default: Story = {};
