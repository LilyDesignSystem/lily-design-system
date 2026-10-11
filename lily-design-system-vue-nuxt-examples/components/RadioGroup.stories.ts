import type { Meta, StoryObj } from '@storybook/vue3-vite';
import RadioGroup from './RadioGroup.vue';

const meta = {
  title: 'Headless/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs']
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
