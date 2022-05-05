import Select from 'react-select';

export const Dropdown = ({onChange, placeholder, options}) => {
    return(
        <Select onChange={onChange} placeholder={placeholder} options={options}/>
    )
}

