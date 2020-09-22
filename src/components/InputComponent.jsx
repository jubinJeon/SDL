import React, {useState,forwardRef} from 'react'

const InputBox = forwardRef(({className, type, placeholder, value, disabled, maxLength},ref) => {

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
                        maxLength = {maxLength}
                        onChange={handleInput}
                        disabled = {disabled}
                />
            </label>
        </>
    )
})

export const NumberInputBox  = forwardRef(({className, placeholder, value, disabled, maxLength},ref) => {
    return (
        <InputBox   className = {className}
                    placeholder = {placeholder}
                    type = 'tel'
                    value = {value}
                    disabled = {disabled}
                    maxLength = {maxLength}
                    ref = {ref}
        />
    )
})

export const TextInputBox  = forwardRef(({className, placeholder, value, disabled,maxLength},ref) => {
    return (
        <InputBox   className = {className}
                    placeholder = {placeholder}
                    type = 'text'
                    value = {value}
                    disabled = {disabled}
                    maxLength = {maxLength}
                    ref = {ref}
        />
    )
})