import { Clicker } from "@/components/global/Clicker";
import { Title } from "@/components/home/Title";

export default function Home() {
  // TODO: Finish Homepage 
  return (
    <div className="flex flex-col gap-8 justify-center items-center h-screen">
      {/* Example React Components */}
      <Title title="Roominate" className="text-6xl font-bold" />
      <Clicker />
    </div>
  );
}
