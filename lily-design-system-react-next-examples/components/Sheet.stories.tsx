import type { Meta, StoryObj } from '@storybook/react-vite';
import Sheet from './Sheet';

const meta = {
  title: 'Headless/Sheet',
  component: Sheet,
  tags: ['autodocs']
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof Sheet>;

export const Default: Story = {};
