import type { Meta, StoryObj } from '@storybook/react-vite';
import InfoState from './InfoState';

const meta = {
  title: 'Headless/InfoState',
  component: InfoState,
  tags: ['autodocs']
} satisfies Meta<typeof InfoState>;

export default meta;
type Story = StoryObj<typeof InfoState>;

export const Default: Story = {};
