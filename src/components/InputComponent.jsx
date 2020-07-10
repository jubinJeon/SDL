import React, {useState,forwardRef} from 'react'

const InputBox = forwardRef(({className, type, placeholder, value, disabled},ref) => {

    const [inputValue, setInputValue] = useState(value)

    const handleInput = (e) => {
        e.preventDefault()
        setInputValue(e.value)
    }

    return(
        <>
            <label className={className} >
                <input  type={type} 
                        placeholder={placeholder} 
                        value={inputValue} 
                        ref={ref} 
                        onChange={handleInput}
                        disabled = {disabled}
                />
            </label>
        </>
    )
})

export const NumberInputBox  = forwardRef(({className, placeholder, value, disabled},ref) => {
    return (
        <InputBox   className = {className}
                    placeholder = {placeholder}
                    type = 'number'
                    value = {value}
                    disabled = {disabled}
                    ref = {ref}
        />
    )
})

export const TextInputBox  = forwardRef(({className, placeholder, value, disabled},ref) => {
    return (
        <InputBox   className = {className}
                    placeholder = {placeholder}
                    type = 'text'
                    value = {value}
                    disabled = {disabled}
                    ref = {ref}
        />
    )
})