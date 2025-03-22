import { Montserrat } from "next/font/google";
import "./globals.css";
import Search from "@/app/[search]/Search";
import Footer from "@/app/footer";

const MontserratSans = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata = {
  title: "Русский Стандарт CS2 | SteamID Finder",
  description: "Конвертация различных видов SteamID",
  keywords: "SteamID Finder, Найти SteamID, Конвертер SteamID, SteamID64, Проверка SteamID, Как узнать свой SteamID, Определить SteamID",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${MontserratSans.variable}`}>
          <div className={`container`}>
              {children}
              {/*<Search search={null} />*/}
              <Footer/>
          </div>
      </body>
    </html>
  );
}
