<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import EmojiCharacterPicker from './EmojiCharacterPicker.svelte';

  const { Story } = defineMeta({
    title: 'Examples/EmojiCharacterPicker',
    component: EmojiCharacterPicker,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Emoji Character Picker'}}
>
  <span>😀</span>
</Story>
