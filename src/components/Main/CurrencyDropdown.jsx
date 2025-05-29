import Select, { components } from "react-select";
import { useContext, useEffect, useState } from "react";
import { CoinContext } from "../../context/CoinContext";
import { FaChevronDown } from "react-icons/fa";

const CurrencyDropdown = () => {
  const { allCurrencies, currency, setCurrency } = useContext(CoinContext);
  const [options, setOptions] = useState([]);


  useEffect(() => {
    const mapped = allCurrencies.map((cur) => ({
      value: cur.abbreviation.toLowerCase(),
      label: `${cur.abbreviation.toUpperCase()} (${decodeHtmlEntity(cur.symbol)})`,
    }));
    setOptions(mapped);
  }, [allCurrencies]);

  const handleChange = (selected) => {
    setCurrency(selected);
  };

  // const selectedOption = options.find(
  //   (opt) => opt.value === (typeof currency === "string" ? currency.toLowerCase() : "")
  // );

  const selectedOption = currency

  // Decode HTML entity to actual symbol
  const decodeHtmlEntity = (str) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
  };

  // Custom dropdown icon on right
  const DropdownIndicator = (props) => {
    return (
      components.DropdownIndicator && (
        <components.DropdownIndicator {...props}>
          <FaChevronDown />
        </components.DropdownIndicator>
      )
    );
  };

  return (
    <div className="w-[180px] text-black">
      {/* <label htmlFor="Currency" className="text-white mb-1 block">
        Currency
      </label> */}
      <Select
        id="Currency"
        value={selectedOption}
        onChange={handleChange}
        options={options}
        components={{ DropdownIndicator }}
        placeholder="Select currency"
        styles={{
          input: (base) => ({
            ...base,
            color: "white",
          }),
          control: (base) => ({
            ...base,
            // backgroundColor: "#1a1a1a",
            backgroundColor: "transparent",
            border: "1px solid #4b5563",
            color: "white",
          }),
          singleValue: (base) => ({
            ...base,
            color: "white",
          }),
          menu: (base) => ({
            ...base,
            zIndex: 9999,
          }),
          dropdownIndicator: (base, state) => ({
            ...base,
            color: state.isFocused ? "lightgray" : "white", // Icon color
            "&:hover": {
              color: "white",
            },
          }),
          clearIndicator: (base, state) => ({
            ...base,
            color: state.isFocused ? "lightgray" : "white",
            "&:hover": {
              color: "white",
            },
          }),
        }}
      />
    </div>
  );
};

export default CurrencyDropdown;
