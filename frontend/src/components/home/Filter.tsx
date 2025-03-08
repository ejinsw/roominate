"use client";

interface Props {
  filters: {
    label: string;
    options: string[];
    callback: (input: string[]) => void;
  }[];
  searchInput: string;
  setSearchInput: (searchInput: string) => void;
  className?: string;
}

const Filter = ({ filters, searchInput, setSearchInput, className }: Props) => {
  const onInputChange = (
    callback: (input: string[]) => void,
    label: string
  ) => {
    const checkboxes = document.querySelectorAll(`.${label}`);
    const checkedValues = Array.from(checkboxes)
      .filter((checkbox) => (checkbox as HTMLInputElement).checked)
      .map(
        (checkbox) => (checkbox as HTMLInputElement).nextSibling?.textContent
      );

    callback(checkedValues.filter((value) => value !== undefined) as string[]);
  };

  return (
    <div
      className={`flex flex-col w-64 min-h-full bg-gray-50 p-5 border-r border-gray-200 ${className}`}
    >
      {/* Search by Name Filter Section */}
      <div className="mb-6">
        <h3 className="text-gray-700 font-medium mb-2 underline">
          Search by Name
        </h3>
        <input
          type="text"
          placeholder="Name"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Other Filters */}
      {filters.map((filter) => (
        <div className="mb-6" key={filter.label}>
          <hr className="border-t border-gray-200 my-4" />
          <h3 className="text-gray-700 font-medium mb-2 underline">
            {filter.label}
          </h3>
          <div className="space-y-2">
            {filter.options.map((option) => (
              <label key={option} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  onChange={() => onInputChange(filter.callback, filter.label)}
                  className={`${filter.label} form-checkbox text-blue-600`}
                />
                <span className="text-gray-700">{option === '5' ? '5+' : option}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      {/* Apply Button */}
      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 mt-6">
        Apply Filter(s)
      </button>
    </div>
  );
};

export default Filter;
