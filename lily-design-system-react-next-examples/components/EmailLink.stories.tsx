import type { Meta, StoryObj } from '@storybook/react-vite';
import EmailLink from './EmailLink';

const meta = {
  title: 'Headless/EmailLink',
  component: EmailLink,
  tags: ['autodocs']
} satisfies Meta<typeof EmailLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
