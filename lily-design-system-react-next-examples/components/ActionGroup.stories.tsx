import type { Meta, StoryObj } from '@storybook/react-vite';
import ActionGroup from './ActionGroup';

const meta = {
  title: 'Headless/ActionGroup',
  component: ActionGroup,
  tags: ['autodocs']
} satisfies Meta<typeof ActionGroup>;

export default meta;
type Story = StoryObj<typeof ActionGroup>;

export const Default: Story = {};
