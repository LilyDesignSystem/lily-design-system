import type { Meta, StoryObj } from '@storybook/react-vite';
import MultiSelect from './MultiSelect';

const meta = {
  title: 'Headless/MultiSelect',
  component: MultiSelect,
  tags: ['autodocs']
} satisfies Meta<typeof MultiSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "Fruit", children: <><option value="a">Apple</option><option value="b">Banana</option></> }
};
