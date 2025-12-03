import { UserProvider } from "../context/userContext";
import { ThemeProvider } from "../context/themeContext";
import { ChatProvider } from "../context/chatContext";
import Header from "../../components/Header";
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
            <ChatProvider>
              <Header />
              {children}
              <Footer />
            </ChatProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
