import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {ChildProps, Icomponent, Item} from "../type/compontent.type";

import Input from "./input";
import SelectBox from "./select";
import Table from "./table";
import File from "./File";
import CheckBox from "./checkbox"


const Box = styled.div`
  padding: 12px 24px;
`

const TitleBox = styled.div`
    font-weight: bold;
  padding-bottom: 20px;
  text-align: center;
    font-size: 16px;
    margin-top: 44px;
`

const ContentBox = styled.ul`
    padding-top: 10px;
  li{
    margin-bottom: 20px;
  }
`

const Component = ({listArr,register,control,setValue,reset,data,getValues,theme,language,name}:ChildProps) =>{
    const [list,setList] = useState<Icomponent>();

    const searchParams = new URLSearchParams(window.location.search);
    const operate = searchParams.get('operate');

    useEffect(() => {

        listArr?.content.map((item:Item)=>{
            if(!!data){
                item.value = data[item.name];
            }else{
                item.value = null;
            }
        })
        listArr.name = name ?? '';
        setList(listArr)
    }, [listArr,operate]);


    return <Box key={list?.id}>
        <TitleBox>{list?.title}</TitleBox>
        <ContentBox>
            {
                list?.content?.map((item,index)=>(
                    <li key={`list_${index}`}>
                        {
                            item.type === "input" && <Input item={item} register={register} type={list?.name} reset={reset} setValue={setValue} theme={theme} />
                        }
                        {
                            item.type === "select" && <SelectBox item={item} control={control} type={list?.name} reset={reset} setValue={setValue} theme={theme} />
                        }
                        {
                            item.type === "table" && <Table item={item} register={register} control={control} type={list?.name} setValue={setValue} reset={reset} getValues={getValues} theme={theme} language={language}  />
                        }
                        {
                            item.type === "file" && <File item={item} register={register}  type={list?.name} setValue={setValue} reset={reset} getValues={getValues}  theme={theme} language={language} />
                        }
                        {
                            item.type === "checkbox" && <CheckBox item={item} register={register} type={list?.name} reset={reset} setValue={setValue} getValues={getValues} theme={theme}  />
                        }
                    </li>
                ))
            }
        </ContentBox>

    </Box>
}

export default Component;
