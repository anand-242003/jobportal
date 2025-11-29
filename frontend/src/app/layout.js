import { UserProvider } from "../context/userContext";
import { ThemeProvider } from "../context/themeContext";
import ConditionalHeader from "../../components/ConditionalHeader";
import Footer from "../../components/Footer";
import "./globals.css";

export const metadata = {
  title: "JobPortal - Find Your Dream Job",
  description: "Connect with top employers and find your next career opportunity",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <UserProvider>
            <ConditionalHeader />
            {children}
            <Footer />
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
