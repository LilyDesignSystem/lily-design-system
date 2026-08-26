"use client";

import { useState } from "react";
import NavigationMenu from "@lily/NavigationMenu";
import MenuBar from "@lily/MenuBar";
import MenuBarButton from "@lily/MenuBarButton";
import ToolBar from "@lily/ToolBar";
import ToolBarButton from "@lily/ToolBarButton";
import HamburgerMenu from "@lily/HamburgerMenu";
import DropdownMenu from "@lily/DropdownMenu";
import Separator from "@lily/Separator";

export default function NavigationAndMenusPage() {
    const [hamburgerOpen, setHamburgerOpen] = useState(false);
    const [fileMenuOpen, setFileMenuOpen] = useState(false);
    const [editMenuOpen, setEditMenuOpen] = useState(false);

    return (
        <main>
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
                <MenuBarButton onClick={() => setFileMenuOpen(!fileMenuOpen)}>
                    File
                </MenuBarButton>
                <MenuBarButton onClick={() => setEditMenuOpen(!editMenuOpen)}>
                    Edit
                </MenuBarButton>
                <MenuBarButton>View</MenuBarButton>
                <MenuBarButton>Help</MenuBarButton>
            </MenuBar>

            <div>
                <DropdownMenu label="File" open={fileMenuOpen} onChange={setFileMenuOpen}>
                    <li role="menuitem" tabIndex={-1}>New Document</li>
                    <li role="menuitem" tabIndex={-1}>Open...</li>
                    <li role="menuitem" tabIndex={-1}>Save</li>
                    <li role="menuitem" tabIndex={-1}>Export as PDF</li>
                </DropdownMenu>

                <DropdownMenu label="Edit" open={editMenuOpen} onChange={setEditMenuOpen}>
                    <li role="menuitem" tabIndex={-1}>Undo</li>
                    <li role="menuitem" tabIndex={-1}>Redo</li>
                    <li role="menuitem" tabIndex={-1}>Cut</li>
                    <li role="menuitem" tabIndex={-1}>Copy</li>
                    <li role="menuitem" tabIndex={-1}>Paste</li>
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
                open={hamburgerOpen}
                onChange={setHamburgerOpen}
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
            </HamburgerMenu>
        </main>
    );
}
