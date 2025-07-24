import React from 'react';
import styled from 'styled-components';

export const InputBox = ({label,placeholder,onChange}) => {
  return (
    <StyledWrapper>
      <div className="input-wrapper">
        {label}
        <input type="text" placeholder={placeholder} onChange={onChange} className="input" />
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .input-wrapper input {
    background-color: #eee;
    border: none;
    padding: 1rem;
    font-size: 1rem;
    width: 13em;
    border-radius: 1rem;
    color: lightcoral;
    box-shadow: 0 0.4rem #dfd9d9;
    cursor: pointer;
  }

  .input-wrapper input:focus {
    outline-color: lightcoral;
  }`;

 
