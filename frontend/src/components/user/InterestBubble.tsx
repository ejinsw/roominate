interface InterestBubbleProps {
  interests: string[];
}

export default function InterestBubble({ interests }: InterestBubbleProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {interests.map((interest, index) => (
        <span 
          key={index}
          className="bg-blue-100 text-blue-800 px-5 py-1 rounded-full text-md"
        >
          {interest}
        </span>
      ))}
    </div>
  );
}
