import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ActionGroup from './ActionGroup.vue';

const meta = {
  title: 'Headless/ActionGroup',
  component: ActionGroup,
  tags: ['autodocs']
} satisfies Meta<typeof ActionGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
