import Menu from "./components/Menu";
import LanguageSwitcherExample from "./LanguageSwitcherExample";
import { LanguageProvider } from "./context/LanguageContext";

export default function RootLayout({ children }: any) {
  return (
    <html>
      <body>

        <LanguageProvider>

          <div style={{ textAlign: "left", padding: 10 }}>
            <LanguageSwitcherExample />
          </div>

          <Menu />

          {children}

        </LanguageProvider>

      </body>
    </html>
  );
}
