import type { Meta, StoryObj } from '@storybook/react-vite';
import MultiSelectWithExtras from './MultiSelectWithExtras';

const meta = {
  title: 'Headless/MultiSelectWithExtras',
  component: MultiSelectWithExtras,
  tags: ['autodocs']
} satisfies Meta<typeof MultiSelectWithExtras>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "Fruit", children: <><option value="a">Apple</option><option value="b">Banana</option></> }
};
