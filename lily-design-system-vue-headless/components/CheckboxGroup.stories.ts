import type { Meta, StoryObj } from '@storybook/vue3-vite';
import CheckboxGroup from './CheckboxGroup.vue';

const meta = {
  title: 'Headless/CheckboxGroup',
  component: CheckboxGroup,
  tags: ['autodocs']
} satisfies Meta<typeof CheckboxGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
