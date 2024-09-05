import '../styles/global.css';

export const metadata = {
  title: "Events",
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
      </head>
      <body>
        <main className="app">
          {children}
        </main>
      </body>
    </html>
  )
}

export default RootLayout