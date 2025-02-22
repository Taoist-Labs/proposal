    import styled from "styled-components";
    import React ,{useEffect, useState} from "react";
    import {TableProps, thProps} from "../type/compontent.type";
    import Input from "./input";
    import SelectBox from "./select";
    import {useFieldArray, Controller, set} from 'react-hook-form';
    import File from "./File";
    import CheckBox from "./checkbox";
    import Minus from "../svg/minus";
    import Add from "../svg/add";
    import Lan from "../utils/lan";
    import ErrorImg from "../svg/error";

    const OuterBox = styled.div`
    `


    const Box = styled.div<{theme?:string}>`
        display: flex;
      align-items: flex-start;
      flex-direction: column;
        background: ${props=> props.theme === 'true'?"#2D2736":"rgba(82, 0, 255, 0.08)"};
        border-radius: 8px;
        margin: 0 5px;
      table{
        width: 100%;
        td,th{
          height: 40px;
            padding-bottom: 10px;
        }
          td:first-child{
              padding-left: 15px;
          }
          td:last-child{
              padding-right: 20px;
          }
          th{
              text-align: center;
          }
        .labelLft{
            display: none;
        }
      }
    
      .sm,.md,.lg{
        width: 100%!important;
        li{
          width: 100%;
        }
      }
    
    `


    const ThBox = styled.th<thProps>`
        width: ${props => props.width+ "%"};
    `

    const AddButton = styled.div<{theme?:string}>`
        background: ${props=>props.theme === 'true'?"#1A1323":"#fff"};
      cursor: pointer;
        width: 40px;
        height: 40px;
        border: ${props=>props.theme === 'true'?"1px solid #29282F":"1px solid rgba(217, 217, 217, 0.50)"};
        border-radius: 8px;
    `

    const BtmBtn = styled.div<{theme?:string}>`
        height: 36px;
        padding: 0 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: ${props=>props.theme === 'true'?"#1A1323":"#fff"};
        cursor: pointer;
        border:${props=>props.theme === 'true'?"1px solid #29282F":"1px solid rgba(217, 217, 217, 0.50)"};
        border-radius: 8px;
        span{
            padding-left: 10px;
        }
    `

    const AddBox = styled.div`
        margin:0 20px 20px;
    `

    // const Tips = styled.div`
    //     margin-bottom: 20px;
    //     font-size: 12px;
    //     opacity: 0.6;
    // `

    const SumBox = styled.div`
        font-weight: bold;
        padding: 20px;
        svg{
            margin-bottom: -3px;
            margin-left: 5px;
        }
        .errorTips{
            margin-left: 10px;
        }
    `

    export default function Table({item,control,type,setValue,reset,getValues,theme,language,baseUrl,version,token,errors,watch,setError,clearErrors,movitationSum,rpc}:TableProps){

        const [column,setColumn] = useState(0);
        const [width,setWidth] = useState<number[]>([]);
        const [header,setHeader] = useState<string[]>([]);
        const [rows,setRows] = useState<any[]>([]);
        const [dataItem,setDataItem] = useState<any>()
        const { fields, append, remove } = useFieldArray({
            control,
            name: `${type}.${item?.name}`,
            rules:{
                required: true
            },
            shouldUnregister:true
        });



        useEffect(() => {
            if(!item.style || !item.rows.length)return;
            const {width,tHeader} = item.style;
            setRows(item.rows)
            setColumn(item.rows.length);
            setWidth(width);
            setHeader(tHeader);
            let obj:any = {};
            item.rows.map((inner:any)=>{
                obj[inner.name] = "";
            })


            if(item?.value?.length){
                item.value?.map((inner:any)=>{
                    append(inner)
                })
            }else{
                append(dataItem)
            }

            setDataItem(obj);

        }, [item]);

        let rt = watch( `${type}.${item?.name}`);

        if(item?.sum && rt?.length){
            const { type,number } = item?.sum;
            let totalObj:any = {};

            rt.map((ii:any)=>{

                if(!ii || !ii[type] || !ii[number])return;


                const key = ii[type]?.name;
                const amount = ii[number];


                if(!totalObj[key]){
                    totalObj[key] = Number(amount)
                }else{
                    totalObj[key]  += Number(amount);
                }
            })
            let strArr =[];
            for(let key in totalObj){
                strArr.push(`${totalObj[key]} ${key}`)
            }
            item.sum.total = strArr.join(",");
        }


        let tableResult = watch(`${type}.${item?.name}`)
        let checkAll = false;
        let tipsErr = "";

        const formatTable = () =>{
            if(!movitationSum || !tableResult)return;
            const totalArr = movitationSum?.split(",")
            const inputTotal = item?.sum?.total?.split(",")

            if (totalArr?.length < inputTotal?.length) {
                checkAll = true;
                tipsErr = "资产数量错误"
                return;
            } else {

                if(inputTotal?.length === 1 && !inputTotal[0])
                {
                    checkAll = false;
                    return;
                }
                for(let i=0;i<inputTotal?.length;i++){
                    let item = inputTotal[i];

                    const remainArr = item.split(' ');
                    const finditemIndex = totalArr.findIndex((innerItem:any) => innerItem.indexOf(remainArr[1])>-1);
                    if (finditemIndex === -1) {
                        checkAll = true;
                        tipsErr = "资产类型错误"
                        // return;
                        break;
                    }
                    const totalNum = totalArr[finditemIndex]?.split(' ')[0];
                    if (Number(totalNum) < Number(remainArr[0])) {
                        checkAll = true;
                        tipsErr = "资产数量错误"
                        break;
                    } else {
                        checkAll = false;
                    }
                }

            }

        }

        formatTable()

        useEffect(() => {
            setValue('motivationResult', checkAll)
        }, [checkAll]);



        useEffect(() => {
            return () =>{
                reset();
            }
        }, []);

        const appendNew = () =>{
            let newItem = dataItem;

            for(let key in newItem){
                const nowItem = item.rows.find((nI:any)=>nI.name === key );
                newItem[key] = nowItem.defaultValue;
            }
            setDataItem(newItem);
            append(newItem)
        }

        if(!item)return null;
        return <OuterBox>
            {/*<Tips>*/}
            {/*    {item?.desc}*/}
            {/*</Tips>*/}
            <Box>

                <table>
                    <thead>
                    <tr>
                        {
                            [...Array(column)].map((col,index)=>(<ThBox key={`thead_${index}`} width={width[index]}>
                                {
                                    header[index]
                                }
                            </ThBox>))
                        }
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        fields.map((field,innerIndex)=>( <tr key={field.id}>
                            {
                                [...Array(column)].map((r,index)=>(<td key={`tbody_${index}`}>
                                    {
                                        rows[index].type === "input" && <Input item={rows[index]} type={type} listName={item?.name} tableIndex={innerIndex} reset={reset} setValue={setValue} theme={theme}  language={language} control={control} getValues={getValues} watch={watch} setError={setError} clearErrors={clearErrors} rpc={rpc} />
                                    }
                                    {
                                        rows[index].type === "select" && <SelectBox item={rows[index]} type={type} listName={item?.name} tableIndex={innerIndex} control={control} reset={reset} setValue={setValue} theme={theme} baseUrl={baseUrl} version={version} token={token} errors={errors} language={language} getValues={getValues} />
                                    }

                                    {
                                        rows[index].type === "file" && <File item={rows[index]} type={type} listName={item?.name} tableIndex={innerIndex} setValue={setValue} reset={reset} getValues={getValues} theme={theme} errors={errors} language={language} control={control}  baseUrl={baseUrl} version={version} />
                                    }
                                    {
                                        rows[index].type === "checkbox" && <CheckBox item={rows[index]} listName={item?.name} tableIndex={innerIndex} control={control} type={type} reset={reset}  setValue={setValue} getValues={getValues}  theme={theme} language={language}/>
                                    }
                                </td>))
                            }

                            <td>
                                <AddButton  theme={theme?.toString()} onClick={() =>remove(innerIndex)}><Minus /></AddButton>
                            </td>
                        </tr>))
                    }
                    </tbody>
                </table>

                <AddBox>
                    <BtmBtn onClick={() => appendNew()}  theme={theme?.toString()}>
                        <Add theme={theme} /> <span>{Lan[language??"zh"]?.add}</span>
                    </BtmBtn>
                </AddBox>

                {
                    !!item?.sum &&  <><SumBox>{item?.sum?.label}: {item?.sum?.total}
                        {
                            checkAll &&<ErrorImg/>
                        }
                        {
                            checkAll &&<span className="errorTips">{tipsErr}</span>
                        }
                    </SumBox> </>
                }


            </Box>

        </OuterBox>
    }
