<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Field from './Field.svelte';

  const { Story } = defineMeta({
    title: 'Examples/Field',
    component: Field,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Field'}}
>
  <input type="text" />
</Story>
