import type { Meta, StoryObj } from '@storybook/react-vite';
import ActionLink from './ActionLink';

const meta = {
  title: 'Headless/ActionLink',
  component: ActionLink,
  tags: ['autodocs']
} satisfies Meta<typeof ActionLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
