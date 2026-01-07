'use client'

import { ThemeProvider as NextThemeProvider } from "next-themes"

export default function ThemeProvider({children}: React.PropsWithChildren) {
    return (
    <NextThemeProvider attribute="class" enableSystem defaultTheme="dark">
        {children}
    </NextThemeProvider>
    )
}