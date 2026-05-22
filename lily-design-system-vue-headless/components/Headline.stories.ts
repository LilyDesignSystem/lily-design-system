import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Headline from './Headline.vue';

const meta = {
  title: 'Headless/Headline',
  component: Headline,
  tags: ['autodocs']
} satisfies Meta<typeof Headline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
