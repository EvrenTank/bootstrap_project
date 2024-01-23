'use client';
import Card from 'react-bootstrap/Card';
import Image from 'next/image';
import {io,Socket} from "socket.io-client";
import { useEffect,useState } from 'react';
import socket from './socket';

const Square = ({imgSrc,index,choosentwo,setChoosentwo,disabled,setDisabled,check,reset,setReset}:{
    imgSrc:string,
    index:string,
    choosentwo:any,
    setChoosentwo:any,
    disabled:any,
    setDisabled:any,
    check:any,
    reset:any,
    setReset:any,
    setPlayerturn:any;
}) => {

    const [open, setOpen]=useState(false);
    const [matched,setMatched] = useState(false);
    const [duration,setDuration] = useState(false);

    const openClose = () => {
        if(choosentwo.first.index == index || choosentwo.second.index == index){
            setOpen(true);
            socket.emit('sendIndex',{
                index:index,
                open:true
            });
        }
        else if(matched){
            setOpen(true);//Burası hemen update edilmedigi icin oluyor o hata. Eşleştikten snra önce kapanıyor snra tekrar açılıyor.
            socket.emit('sendIndex',{
                index:index,
                open:true
            });        }
        else if(!matched){
            setOpen(false);
            socket.emit('sendIndex',{
                index:index,
                open:false
            });          }
    }

    const checkIfMatched = () => {
        //console.log("disabled",disabled);
        for(let i=0;i<disabled.length;i++) {
            // console.log("disabled[",i,"]==",disabled[i]);
            if(disabled[i] == index ){
                setMatched(true);
                socket.emit('isMatched',{
                    index:index,
                    matched:true
                });
                //console.log("matched",matched);
            }
        }
        setTimeout(openClose,100);  
    }
    useEffect(()=>{
        checkIfMatched();
    },[disabled,choosentwo,matched]);

    useEffect(()=> {
        socket.on("getIndex",(data:{index:string,open:boolean})=>{
            //console.log("burası çalışıyor");
            //console.log("data",data);
            //console.log("data.index",data.index);
            //console.log("index",index);
            if(data.index == index){
                //console.log("data.index",data.index);
                //console.log("data.open",data.open);
                setOpen(data.open);
            }
        });
        socket.on("setMatched",(data) => {
            if(data.index == index && data.matched == true){
                setMatched(true);
            }
        });
    },[open]);

    
    useEffect(()=>{
        setOpen(false);
        setMatched(false);
        setDuration(true);
        setTimeout(()=>{setDuration(false)},300);

    },[reset]);

    return (
        <Card className='w-auto ratio ratio-1x1' 
        style={{
            cursor:'pointer',
            pointerEvents: matched ? "none":"auto",
            opacity: matched ? 0.5 : 1,
        }}
        onClick={()=>{
            check(imgSrc,index);
        }}
>
            <Card className='w-100 h-100' style={{
                transformOrigin:'center',
                transitionDuration: duration ? '0s' : '1s',
                transform: !open ? 'rotateY(180deg)' : 'rotateY(0deg)',
                backfaceVisibility:'hidden'
            }} >
                <Card className='w-100 h-100 bg-primary' style={{
                    transformOrigin:'right',
                    transform:'rotateY(360deg)',
                }} ></Card>
                <Image src={imgSrc} alt={`${index}`} fill={true}></Image>
                </Card>
        </Card>

    )
}
export default Square;