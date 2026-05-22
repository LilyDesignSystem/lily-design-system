import type { Meta, StoryObj } from '@storybook/react-vite';
import ClampText from './ClampText';

const meta = {
  title: 'Headless/ClampText',
  component: ClampText,
  tags: ['autodocs']
} satisfies Meta<typeof ClampText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
