import Image from 'next/image';
import styles from './styles/Square.module.scss';
import { useState,useEffect,useRef } from 'react';
import { Card } from 'react-bootstrap';
const Square = ({index,mined,minedsquares,flagsNumber,setFlagsNumber,openedsquares,setOpenedsquares,msk,setMsk,reset,colRowNumbers}:{
    index:string,
    mined:boolean,
    minedsquares:{rowIndex:number,colIndex:number}[],
    flagsNumber:number,
    setFlagsNumber:any,
    openedsquares:string[],
    setOpenedsquares:any,
    msk:boolean,
    setMsk:any,
    reset:boolean,
    colRowNumbers:{rowNumber:number, colNumber:number}
}) => {

    const [clicked,setClicked] = useState(false);
    const [leftclicked,setLeftclicked] = useState(false);
    const [number,setNumber] = useState(0);
    
    const handleRightClick = (event:any) => {
        event.preventDefault();
        if(!leftclicked){
            if(!clicked){
                setFlagsNumber((prev:number)=>prev-1);
            }
            else if(clicked){
                setFlagsNumber((prev:number)=>prev+1);
            }
            setClicked((prev)=> !prev);   
        }  
    }
    const handleLeftClick = () => {
        if(!clicked){
            setLeftclicked(true);  
            setOpenedsquares((openedsquares:string[])=>[...openedsquares,index]);//Burasi if(number == 0 && !mined )icine aktariliyor. Cunku state 
            //degeri henuz update edilmedigi icin deger okunmuyor.
            if(number == 0 && !mined ){
                const rowIndex = parseInt(index.split(" ")[0]); 
                const colIndex = parseInt(index.split(" ")[1]); 
                const new_squares = [
                    ...openedsquares,
                    index,
                    `${(rowIndex+1)} ${(colIndex+1)}`,
                    `${(rowIndex+1)} ${(colIndex)}`,
                    `${(rowIndex+1)} ${(colIndex-1)}`,
                    `${(rowIndex)} ${(colIndex+1)}`,
                    `${(rowIndex)} ${(colIndex-1)}`,
                    `${(rowIndex-1)} ${(colIndex+1)}`,
                    `${(rowIndex-1)} ${(colIndex)}`,
                    `${(rowIndex-1)} ${(colIndex-1)}`,               
                ].filter((square)=>{
                    const rI = parseInt(square.split(" ")[0]);
                    const cI = parseInt(square.split(" ")[1]);
                    return rI>=0 && rI<colRowNumbers.rowNumber && cI>=0 && cI<colRowNumbers.colNumber;
                }).filter((value,index,array)=>{
                    return array.indexOf(value) === index;
                });


                setOpenedsquares(new_squares);

            }
            if(mined){
                setMsk((msk:boolean) => true);
            }  
        }    
    }

    const f  =() => {
        
    }


    const countNeighborMines = () => {
        const rowIndex = parseInt(index.split(" ")[0]);
        const colIndex = parseInt(index.split(" ")[1]);
        console.log("rowIndex ",rowIndex," type ",typeof(rowIndex));
        console.log("colIndex",colIndex);
        if(!mined){
            for(let i=0;i<minedsquares.length;i++){
                console.log(minedsquares[i]);
                if(colIndex == minedsquares[i].colIndex && (rowIndex == minedsquares[i].rowIndex-1 || rowIndex == minedsquares[i].rowIndex+1)){
                  setNumber((prev)=>{
                    return prev+1;
                  })
                  continue;
                }
                else if(rowIndex == minedsquares[i].rowIndex && (colIndex == minedsquares[i].colIndex-1 || colIndex == minedsquares[i].colIndex+1)){
                    setNumber((prev)=>{
                      return prev+1;
                    })
                    continue;
                }
                else if((rowIndex == minedsquares[i].rowIndex-1 || rowIndex == minedsquares[i].rowIndex+1 ) && 
                (colIndex == minedsquares[i].colIndex-1 || colIndex == minedsquares[i].colIndex+1)){
                    setNumber((prev)=>{
                        return prev+1;
                      })
                      continue;
                }
        }
    }
}

useEffect(()=>{
    setNumber(0);//useEffect iki defa calistigi icin number degeri olması gerekenin iki kati cikiyordu. Bundan dolayi
    // useEffect baslangicinda number degerini 0 yaptim ve bu sorunu cozdum.
    countNeighborMines();
    console.log("number ", number)
},[reset]);

useEffect(()=>{
    console.log("openedsquares", openedsquares);
    for(let i of openedsquares){
        if(i.split(" ")[0] === index.split(" ")[0] && i.split(" ")[1] === index.split(" ")[1]){
            setLeftclicked(true);
        }
    }
},[openedsquares]);

useEffect(()=>{
    setClicked(false);
    setLeftclicked(false);
},[reset]);

useEffect(() =>{
    if(mined && msk){
        const randomTimeout = Math.floor(Math.random()*10);
        setTimeout(()=>{
            setLeftclicked(true);
        }, randomTimeout*50);
    }
    else {
        for(let i=0;i<openedsquares.length;i++){
            if(openedsquares[i]){}
        }
    }
},[openedsquares]);

    return (
        <Card className={`w-auto ratio ratio-1x1 ${leftclicked ? 'bg-light':'bg-white' } `}
        onContextMenu={handleRightClick}
        onClick={handleLeftClick}
        style={{
            cursor:'pointer',
        }}
       >
       {(clicked) &&
        <Image className=' w-50 h-auto position-absolute top-50 start-50 translate-middle'
        src={'/minesweeper-images/location.png'} alt='flag' width={50} height={50}></Image>}
       {
        (leftclicked && !mined) &&
         <span className='position-absolute top-50 start-50 translate-middle fw-bold d-flex justify-content-center align-items-center ' >{number}</span> 
       }
       {(leftclicked && mined ) &&
        <Image className=' w-50 h-auto position-absolute top-50 start-50 translate-middle'
        src={'/minesweeper-images/explosion.png'} alt='flag' width={50} height={50}></Image>
       }
        </Card>
    )
}
export default Square;