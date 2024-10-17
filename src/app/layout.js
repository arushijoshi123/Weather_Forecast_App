import "@/styles/globals.css";

export const metadata = {
  title: "WeatherForecastApp||by@Arushi",
  description: "gives current and next 4 days weather forecast",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
