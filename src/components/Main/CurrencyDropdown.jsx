import Select, { components } from "react-select";
import { useContext, useEffect, useState } from "react";
import { CoinContext } from "../../context/CoinContext";
import { FaChevronDown } from "react-icons/fa";

const CurrencyDropdown = () => {
  const { allCurrencies, currency, setCurrency } = useContext(CoinContext);
  const [options, setOptions] = useState([]);


  useEffect(() => {
    const mapped = allCurrencies.map((cur) => ({
      value: cur.code.toLowerCase(),
      label: `${cur.code.toUpperCase()} - ${decodeHtmlEntity(cur.symbol)}`,
    }));
    setOptions(mapped);
  }, [allCurrencies]);

  const handleChange = (selected) => {
    setCurrency(selected);
    console.log(selected)
  };

  const selectedOption = currency

  const decodeHtmlEntity = (str) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
  };

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
    <div className="md:w-[180px] text-black">
      {/* <label htmlFor="Currency" className="text-white mb-1 block">
        Currency
      </label> */}
      <Select
        id="Currency"
        className="focus:outline-none"
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
            backgroundColor: "transparent",
            border: "1px solid #9ca3af",
            color: "white",
            cursor:'pointer',
            "&:hover": {
              borderColor: "#a78bfa",
            },
            "&:focus": {
              borderColor: "#a78bfa",
            },
            '&:focus-visible':{
              outline:'none !important',
            }
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
            color: state.isFocused ? "lightgray" : "white", 
            fontSize: '0.9rem',
            "&:hover": {
              color: "white",
            },
          }),
          clearIndicator: (base, state) => ({
            ...base,
            color: state.isFocused ? "lightgray" : "white",
            fontSize: '0.9rem',
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
