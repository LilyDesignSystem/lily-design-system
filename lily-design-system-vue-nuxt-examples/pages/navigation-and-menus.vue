<script setup lang="ts">
import { ref } from "vue";

const hamburgerOpen = ref(false);
const fileMenuOpen = ref(false);
const editMenuOpen = ref(false);
</script>

<template>
    <main class="page-wrapper">
        <h1>Navigation and Menu Patterns</h1>

        <NavigationMenu label="Main navigation">
            <a href="#home">Home</a>
            <a href="#projects">Projects</a>
            <a href="#team">Team</a>
            <a href="#reports">Reports</a>
            <a href="#settings">Settings</a>
        </NavigationMenu>

        <Separator label="Section divider" />

        <h2>Application Menu Bar</h2>
        <MenuBar label="Application menu">
            <MenuBarButton @click="fileMenuOpen = !fileMenuOpen">File</MenuBarButton>
            <MenuBarButton @click="editMenuOpen = !editMenuOpen">Edit</MenuBarButton>
            <MenuBarButton>View</MenuBarButton>
            <MenuBarButton>Help</MenuBarButton>
        </MenuBar>

        <div>
            <DropdownMenu
                v-if="fileMenuOpen"
                label="File"
                :open="fileMenuOpen"
            >
                <li
                    role="menuitem"
                    :tabindex="-1"
                >
                    New Document
                </li>
                <li
                    role="menuitem"
                    :tabindex="-1"
                >
                    Open...
                </li>
                <li
                    role="menuitem"
                    :tabindex="-1"
                >
                    Save
                </li>
                <li
                    role="menuitem"
                    :tabindex="-1"
                >
                    Export as PDF
                </li>
            </DropdownMenu>

            <DropdownMenu
                v-if="editMenuOpen"
                label="Edit"
                :open="editMenuOpen"
            >
                <li
                    role="menuitem"
                    :tabindex="-1"
                >
                    Undo
                </li>
                <li
                    role="menuitem"
                    :tabindex="-1"
                >
                    Redo
                </li>
                <li
                    role="menuitem"
                    :tabindex="-1"
                >
                    Cut
                </li>
                <li
                    role="menuitem"
                    :tabindex="-1"
                >
                    Copy
                </li>
                <li
                    role="menuitem"
                    :tabindex="-1"
                >
                    Paste
                </li>
            </DropdownMenu>
        </div>

        <Separator />

        <h2>Document Toolbar</h2>
        <ToolBar label="Document formatting">
            <ToolBarButton>Bold</ToolBarButton>
            <ToolBarButton>Italic</ToolBarButton>
            <ToolBarButton>Underline</ToolBarButton>
            <ToolBarButton disabled>Strikethrough</ToolBarButton>
            <ToolBarButton>Align Left</ToolBarButton>
            <ToolBarButton>Align Center</ToolBarButton>
            <ToolBarButton>Align Right</ToolBarButton>
        </ToolBar>

        <Separator />

        <h2>Mobile Navigation</h2>
        <HamburgerMenu
            label="Mobile menu"
            :expanded="hamburgerOpen"
            @click="hamburgerOpen = !hamburgerOpen"
        />
        <NavigationMenu
            v-if="hamburgerOpen"
            label="Mobile navigation"
        >
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#projects">Projects</a></li>
                <li><a href="#team">Team</a></li>
                <li><a href="#reports">Reports</a></li>
                <li><a href="#settings">Settings</a></li>
                <li><a href="#profile">Profile</a></li>
                <li><a href="#logout">Log Out</a></li>
            </ul>
        </NavigationMenu>
    </main>
</template>
