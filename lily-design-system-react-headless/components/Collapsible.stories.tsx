import type { Meta, StoryObj } from '@storybook/react-vite';
import Collapsible from './Collapsible';

const meta = {
  title: 'Headless/Collapsible',
  component: Collapsible,
  tags: ['autodocs']
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof Collapsible>;

export const Default: Story = {};
