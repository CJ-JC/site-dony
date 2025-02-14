import { Search } from "lucide-react";

const SearchInput = ({ handleSearch, searchQuery }) => {
  return (
    <div className="relative flex w-full items-center md:w-auto">
      <Search className="text-slate-600 absolute left-3 top-3 h-4 w-4" />
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        className="peer h-full w-full rounded-md border border-blue-gray-200 bg-transparent px-3 py-3 pl-9 font-sans text-sm font-normal text-blue-gray-700 outline-none transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border focus:border-gray-900 focus:outline-none disabled:border-0 disabled:bg-blue-gray-50 md:w-[400px]"
        placeholder="Chercher une formation"
      />
    </div>
  );
};

export default SearchInput;
