import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ActionGroup from './ActionGroup';

const meta = {
  title: 'Examples/ActionGroup',
  component: ActionGroup,
  tags: ['autodocs']
} satisfies Meta<typeof ActionGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
