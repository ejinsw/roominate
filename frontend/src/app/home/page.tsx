import { HomePage } from "@/components/home/HomePage";
import { getHousing, getPreferences } from "@/lib/utils";

interface HomeProps {
  searchParams: { query?: string };
}

export default async function Home({ searchParams }: HomeProps) {
  const preferences = await getPreferences().then((data) => 
    data.map((pref) => pref.value)
  );
  
  const housing = await getHousing().then((data) => 
    data.map((house) => house.name ?? "")
  );

  const query = searchParams.query ?? "";

  return <HomePage query={query} housing={housing} preferences={preferences} />;
}