import "./globals.css";
import { Plus_Jakarta_Sans, Instrument_Serif } from "next/font/google";
import Navbar from "./components/Navbar";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["italic"],
  variable: "--font-italic",
});

export const metadata = {
  title: "Ghina",
  description: "Personal portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.variable} ${instrumentSerif.variable}`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}