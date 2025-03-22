import Image from "next/image";
import styles from "./page.module.css";
import Footer from "@/app/footer";
import Search from "@/app/[search]/Search";

export default function Home() {
  return (
    <Search search={null} />
  );
}
