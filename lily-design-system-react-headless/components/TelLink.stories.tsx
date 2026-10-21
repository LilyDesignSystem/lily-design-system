import type { Meta, StoryObj } from '@storybook/react-vite';
import TelLink from './TelLink';

const meta = {
  title: 'Headless/TelLink',
  component: TelLink,
  tags: ['autodocs']
} satisfies Meta<typeof TelLink>;

export default meta;
type Story = StoryObj<typeof TelLink>;

export const Default: Story = {};
