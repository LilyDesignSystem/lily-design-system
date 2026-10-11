import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Container from './Container.vue';

const meta = {
  title: 'Headless/Container',
  component: Container,
  tags: ['autodocs']
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
