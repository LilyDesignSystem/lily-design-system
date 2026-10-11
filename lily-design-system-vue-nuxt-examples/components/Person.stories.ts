import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Person from './Person.vue';

const meta = {
  title: 'Headless/Person',
  component: Person,
  tags: ['autodocs']
} satisfies Meta<typeof Person>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
