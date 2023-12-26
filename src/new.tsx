import React, {ChangeEvent, useRef, useState} from 'react';
import Template from "./packages/components/template";
import initialItems from "./json/initialItem";
import DataSource from "./json/datasource.json";
import styled from "styled-components";
import {useParams} from "react-router-dom";


const ButtonBox = styled.div`

  padding: 20px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
    margin-bottom: 40px;
`

function New() {
    const childRef = useRef(null);
    const [test,setTest] = useState('');
    const hash = window.location.hash;
    const searchParams = new URLSearchParams(hash.split('?')[1]);
    const operate = searchParams.get('operate')
    
    const handleInput = (e:ChangeEvent) =>{
        const {value} = e.target as HTMLInputElement;
        setTest(value)
    }


    const handleFormSubmit = (data:any) => {
        console.log({
            ...data,
            test
        })
    };


    const AllSubmit = () =>{
        (childRef.current as any).submitForm()
    }

    return (
        <div>
        <Template DataSource={DataSource} operate={operate} initialItems={initialItems} BeforeComponent={ <input type="text" onChange={handleInput} />} AfterComponent={<div>-----test add after-----</div>}  ref={childRef} onSubmitData={handleFormSubmit} />
            <ButtonBox>

                <button onClick={() => AllSubmit()}>submit</button>
            </ButtonBox>

        </div>
    );
}

export default New;
