import Image from "next/image";

interface CircleProfileProps {
  imageSrc: string;
  name: string;
  year: string;
  major: string;
}

export default function CircleProfile({ imageSrc, name, year, major }: CircleProfileProps) {
  return (
    <div className="flex items-center gap-8 mb-6">
      <div className="relative w-32 h-32">
        <Image
          src={imageSrc}
          alt="Profile picture"
          fill
          className="rounded-full object-cover border-2 border-[#2774AE]"
        />
      </div>
      
      <div>
        <h1 className="text-5xl font-bold text-[#2774AE] drop-shadow-sm">{name}</h1>
        <p className="text-gray-700 text-lg font-medium">{year} • {major}</p>
      </div>
    </div>
  );
}
