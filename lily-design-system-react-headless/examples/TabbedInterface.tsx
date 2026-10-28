// Example: Tabbed interface with content panels
//
// Demonstrates: TabBar, TabBarButton, Collapsible, AccordionNav,
// AccordionList, AccordionListItem, Badge

import { useState } from "react";
import TabBar from "../components/TabBar";
import TabBarButton from "../components/TabBarButton";
import AccordionNav from "../components/AccordionNav";
import AccordionList from "../components/AccordionList";
import AccordionListItem from "../components/AccordionListItem";
import Badge from "../components/Badge";

interface Notification {
    id: number;
    title: string;
    message: string;
    type: "info" | "warning" | "error";
    read: boolean;
}

const notifications: Notification[] = [
    { id: 1, title: "Welcome", message: "Thanks for signing up!", type: "info", read: true },
    {
        id: 2,
        title: "Update available",
        message: "Version 2.0 is ready.",
        type: "info",
        read: false,
    },
    {
        id: 3,
        title: "Disk space low",
        message: "Less than 10% remaining.",
        type: "warning",
        read: false,
    },
    {
        id: 4,
        title: "Build failed",
        message: "CI pipeline error on main.",
        type: "error",
        read: false,
    },
];

export default function TabbedInterface() {
    const [activeTab, setActiveTab] = useState("all");
    const unreadCount = notifications.filter((n) => !n.read).length;

    const filtered = activeTab === "all" ? notifications : notifications.filter((n) => !n.read);

    return (
        <div>
            <h2>Notifications</h2>

            <TabBar label="Notification filters">
                <TabBarButton
                    selected={activeTab === "all"}
                    controls="all-panel"
                    onClick={() => setActiveTab("all")}
                >
                    All
                </TabBarButton>
                <TabBarButton
                    selected={activeTab === "unread"}
                    controls="unread-panel"
                    onClick={() => setActiveTab("unread")}
                >
                    Unread <Badge type="warning">{unreadCount}</Badge>
                </TabBarButton>
            </TabBar>

            <div id={activeTab === "all" ? "all-panel" : "unread-panel"}>
                <AccordionNav label="Notification details">
                    <AccordionList>
                        {filtered.map((item) => (
                            <AccordionListItem key={item.id}>
                                <h3>
                                    {item.title}
                                    {!item.read && <Badge type="info">New</Badge>}
                                    <Badge
                                        type={
                                            item.type === "error"
                                                ? "error"
                                                : item.type === "warning"
                                                  ? "warning"
                                                  : "default"
                                        }
                                    >
                                        {item.type}
                                    </Badge>
                                </h3>
                                <p>{item.message}</p>
                            </AccordionListItem>
                        ))}
                    </AccordionList>
                </AccordionNav>
            </div>
        </div>
    );
}
