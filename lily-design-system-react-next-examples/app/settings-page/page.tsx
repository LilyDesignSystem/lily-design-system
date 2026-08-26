"use client";

import { useState } from "react";
import SwitchButton from "@lily/SwitchButton";
import RadioGroup from "@lily/RadioGroup";
import RadioInput from "@lily/RadioInput";
import Select from "@lily/Select";
import Option from "@lily/Option";
import Separator from "@lily/Separator";
import Fieldset from "@lily/Fieldset";
import Button from "@lily/Button";
import Banner from "@lily/Banner";

export default function SettingsPagePage() {
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);
    const [emailDigest, setEmailDigest] = useState(true);
    const [language, setLanguage] = useState("en");
    const [fontSize, setFontSize] = useState("medium");
    const [saved, setSaved] = useState(false);

    function handleSave() {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    }

    return (
        <main>
            <h1>Settings</h1>

            {saved && (
                <Banner type="success" dismissible closeLabel="Dismiss">
                    Settings saved successfully.
                </Banner>
            )}

            <Fieldset legend="Appearance">
                <SwitchButton
                    label="Dark mode"
                    checked={darkMode}
                    onChange={setDarkMode}
                />
                <Separator />
                <Select
                    label="Language"
                    value={language}
                    onChange={setLanguage}
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
                        checked={fontSize === "small"}
                        onChange={() => setFontSize("small")}
                    />
                    <RadioInput
                        label="Medium"
                        name="fontSize"
                        value="medium"
                        checked={fontSize === "medium"}
                        onChange={() => setFontSize("medium")}
                    />
                    <RadioInput
                        label="Large"
                        name="fontSize"
                        value="large"
                        checked={fontSize === "large"}
                        onChange={() => setFontSize("large")}
                    />
                </RadioGroup>
            </Fieldset>

            <Fieldset legend="Notifications">
                <SwitchButton
                    label="Push notifications"
                    checked={notifications}
                    onChange={setNotifications}
                />
                <Separator />
                <SwitchButton
                    label="Daily email digest"
                    checked={emailDigest}
                    onChange={setEmailDigest}
                />
            </Fieldset>

            <Button onClick={handleSave}>Save Settings</Button>
        </main>
    );
}
