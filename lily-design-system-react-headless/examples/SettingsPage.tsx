// Example: Settings page with toggles, selects, and radio groups
//
// Demonstrates: SwitchButton, RadioGroup, RadioInput, Select, Option,
// Separator, Fieldset, Button, Banner

import { useState } from "react";
import SwitchButton from "../components/SwitchButton";
import RadioGroup from "../components/RadioGroup";
import RadioInput from "../components/RadioInput";
import Select from "../components/Select";
import Option from "../components/Option";
import Separator from "../components/Separator";
import Fieldset from "../components/Fieldset";
import Button from "../components/Button";
import Banner from "../components/Banner";

export default function SettingsPage() {
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
        <div>
            <h1>Settings</h1>

            {saved && (
                <Banner
                    type="success"
                    dismissible
                    closeLabel="Dismiss"
                >
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
        </div>
    );
}
