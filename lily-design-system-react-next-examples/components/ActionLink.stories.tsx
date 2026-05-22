import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ActionLink from './ActionLink';

const meta = {
  title: 'Examples/ActionLink',
  component: ActionLink,
  tags: ['autodocs']
} satisfies Meta<typeof ActionLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
