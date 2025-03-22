import Search from "@/app/[search]/Search";

const fetchData = async (search) => {
    const data = await fetch("", {});
}

export default async function ({ params }) {
    const { search } = await params;
    return <Search search={search} />;
}