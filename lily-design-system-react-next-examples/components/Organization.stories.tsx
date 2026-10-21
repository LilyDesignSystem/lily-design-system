import type { Meta, StoryObj } from '@storybook/react-vite';
import Organization from './Organization';

const meta = {
  title: 'Headless/Organization',
  component: Organization,
  tags: ['autodocs']
} satisfies Meta<typeof Organization>;

export default meta;
type Story = StoryObj<typeof Organization>;

export const Default: Story = {};
