<script setup lang="ts">
import { ref } from "vue";

const darkMode = ref(false);
const notifications = ref(true);
const emailDigest = ref(true);
const language = ref("en");
const fontSize = ref("medium");
const saved = ref(false);

function handleSave() {
    saved.value = true;
    setTimeout(() => {
        saved.value = false;
    }, 3000);
}
</script>

<template>
    <main class="page-wrapper">
        <h1>Settings</h1>

        <Banner
            v-if="saved"
            type="success"
        >
            Settings saved successfully.
        </Banner>

        <Fieldset legend="Appearance">
            <SwitchButton
                label="Dark mode"
                :checked="darkMode"
                @change="darkMode = $event"
            />
            <Separator />
            <Select
                label="Language"
                v-model="language"
            >
                <Option value="en">English</Option>
                <Option value="es">Spanish</Option>
                <Option value="fr">French</Option>
                <Option value="de">German</Option>
                <Option value="ja">Japanese</Option>
            </Select>
            <Separator />
            <RadioGroup label="Font size">
                <RadioInput
                    label="Small"
                    name="fontSize"
                    value="small"
                    :checked="fontSize === 'small'"
                    @change="fontSize = 'small'"
                />
                <RadioInput
                    label="Medium"
                    name="fontSize"
                    value="medium"
                    :checked="fontSize === 'medium'"
                    @change="fontSize = 'medium'"
                />
                <RadioInput
                    label="Large"
                    name="fontSize"
                    value="large"
                    :checked="fontSize === 'large'"
                    @change="fontSize = 'large'"
                />
            </RadioGroup>
        </Fieldset>

        <Fieldset legend="Notifications">
            <SwitchButton
                label="Push notifications"
                :checked="notifications"
                @change="notifications = $event"
            />
            <Separator />
            <SwitchButton
                label="Daily email digest"
                :checked="emailDigest"
                @change="emailDigest = $event"
            />
        </Fieldset>

        <Button @click="handleSave">Save Settings</Button>
    </main>
</template>
