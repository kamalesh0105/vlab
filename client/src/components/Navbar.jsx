import * as React from "react"
import { CircleCheckIcon, CircleHelpIcon, CircleIcon } from "lucide-react"
import { Link } from "react-router-dom"

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "../components/ui/navigation-menu"

const components = [
    {
        title: "Alert Dialog",
        to: "/docs/primitives/alert-dialog",
        description:
            "A modal dialog that interrupts the user with important content and expects a response.",
    },
    {
        title: "Hover Card",
        to: "/docs/primitives/hover-card",
        description:
            "For sighted users to preview content available behind a link.",
    },
    {
        title: "Progress",
        to: "/docs/primitives/progress",
        description:
            "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
    },
    {
        title: "Scroll-area",
        to: "/docs/primitives/scroll-area",
        description: "Visually or semantically separates content.",
    },
    {
        title: "Tabs",
        to: "/docs/primitives/tabs",
        description:
            "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
    },
    {
        title: "Tooltip",
        to: "/docs/primitives/tooltip",
        description:
            "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
    },
]

function NavigationMenuBar() {
    return (
        <NavigationMenu viewport={false}>
            <NavigationMenuList>
                {/* <NavigationMenuItem>
                    <NavigationMenuTrigger>Components</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                            {components.map((component) => (
                                <ListItem
                                    key={component.title}
                                    title={component.title}
                                    to={component.to}
                                >
                                    {component.description}
                                </ListItem>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem> */}
                <NavigationMenuItem>
                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                        <Link to="/docs">Docs</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                        <Link to="/docs">About</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                        <Link to="/login">Signin</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                        <a className="border border-b-gray-500 rounded-xl" href="https://github.com/kamalesh0105/vlab" target="_blank" rel="noopener noreferrer">
                            <img
                                className="w-12 h-10  "
                                src="/github.svg"
                                alt="Github"
                            />
                        </a>
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}

function ListItem({
    title,
    children,
    to,
    ...props
}) {
    return (
        <li {...props}>
            <NavigationMenuLink asChild>
                <Link to={to}>
                    <div className="text-sm leading-none font-medium">{title}</div>
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                        {children}
                    </p>
                </Link>
            </NavigationMenuLink>
        </li>
    )
}
const Navbar = () => (
    <div className="flex items-center justify-between py-3 px-6 border-b">
        <div className="flex items-center">
            <img src="/vlabs.png" alt="Logo" className="h-12 w-14" />
            <Link to="/" className="text-md font-bold">
                Vlabs
            </Link>
        </div>

        <NavigationMenuBar />
    </div>
)


export default Navbar;