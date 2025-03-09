const Banner = () => {
  return (
    <div className="relative bg-sky-100 py-10 px-10 overflow-hidden w-full">
      {/* Decorative spots */}
      <div className="absolute w-32 h-32 -top-8 left-[10%] rounded-full bg-sky-200/30" />
      <div className="absolute w-24 h-24 bottom--4 right-[15%] rounded-full bg-sky-200/30" />
      <div className="absolute w-20 h-20 top-[40%] left-[5%] rounded-full bg-sky-200/20" />
      <div className="absolute w-28 h-28 top-[20%] right-[8%] rounded-full bg-sky-200/20" />

      {/* Content */}
      <div className="relative text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Find your next roommate at UCLA
        </h1>
        <h2 className="text-xl text-gray-600">
          Search by building, room type, and other preferences
        </h2>
      </div>
    </div>
  );
};

export default Banner;
