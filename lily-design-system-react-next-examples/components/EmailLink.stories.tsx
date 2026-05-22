import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import EmailLink from './EmailLink';

const meta = {
  title: 'Examples/EmailLink',
  component: EmailLink,
  tags: ['autodocs']
} satisfies Meta<typeof EmailLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
