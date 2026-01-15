// Components
import Nav from "../../components/ui/Nav/Nav";
import Footer from "../../components/ui/Footer/Footer";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Nav />
      {children}
      <Footer />
    </div>
  );
}
