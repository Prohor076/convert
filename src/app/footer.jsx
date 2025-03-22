import Link from "next/link";

export default function Footer() {
    return (
        <footer>
            <Link href={`https://rus-standart.xyz`} target={`_blank`} rel="noopener noreferrer">Русский Стандарт CS2 | rus-standart.xyz</Link>
        </footer>
    );
}