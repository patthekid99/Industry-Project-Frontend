import Select from "react-select";

export const Dropdown = ({ onChange, placeholder, options }) => {
  return (
    <Select
      menuPortalTarget={document.body}
      styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
      className="pr-1 pl-1"
      onChange={onChange}
      placeholder={placeholder}
      options={options}
    />
  );
};
