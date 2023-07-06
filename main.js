#!/usr/bin/env node //it tell this script should be run in which environment
// #todo
// [*]help
// [*]organize
// [*]Tree
// [*]global
// []cover some good practice

let inputArr=process.argv.slice(2);
let fs = require("fs");
let path=require("path");
// node main.js tree "directoryPath"
// node main.js organize "directoryPath"
// node main.js help"
let command=inputArr[0];
let types={
    media: ["mp4","mkv"],
    archices: ['zip','7z','tar','gz','ar','iso','xz'],
    document: ['docx','doc','pdf','xlsx','xls','odt','ods','odp','odg','odf','txt','ps','tex'],
    app: ['exe','dmg','pkg','deb']
}
switch(command){
    case "tree":
        treeFn(inputArr[1]);
        break;
    case "organize":
        organizeFn(inputArr[1]);
        break;
    case "help":
        helpFn();
        break;
    default:
        console.log("please input right command");
}

function treeFn(dirPath){
    // let destPath;
    if(dirPath==undefined){
        treeHelper(process.cwd(),"");
        return;
    }else{
        let doesExist=fs.existsSync(dirPath);
        if(doesExist){
            treeHelper(dirPath,"");
        }else{
            console.log("Kindly enter the correct path");
            return;
        }
    }
}
function treeHelper(dirPath,indent){
    //is file or folder
    let isFile=fs.lstatSync(dirPath).isFile();
    if(isFile==true){
        let fileName=path.basename(dirPath);
        console.log(indent+"├── "+fileName);
    }else{
        let dirName=path.basename(dirPath);
        console.log(indent+"└── "+dirName);
        let childerens=fs.readdirSync(dirPath);
        for(let i=0;i<childerens.length;i++){
            let childPath=path.join(dirPath);
            treeHelper(childPath,indent+"\t");
        }
    }
}
function organizeFn(dirPath){
    // 1. input -> directory path given
    let destPath;
    if(dirPath==undefined){
        destPath=process.cwd();
        return;
    }else{
        let doesExist=fs.existsSync(dirPath);
        if(doesExist){
            // 2. create -> organized_file -> directory
            destPath=path.join(dirPath,"organized_file");
            if(fs.existsSync(destPath)==false){
                fs.mkdirSync(destPath);
            }
        }else{
            console.log("Kindly enter the correct path");
            return;
        }
    }
    organizeHelper(dirPath,destPath);

    // 4. copy/cut files to that organized directory inside of any of category folder
}
function organizeHelper(src,dest){
    // 3. identify category of all the files present in that input directory ->
    let childNames=fs.readdirSync(src);
    // console.log(childNames);

    for(let i=0;i<childNames.length;i++){
        let childAddress=path.join(src,childNames[i]);
        let isFile=fs.lstatSync(childAddress).isFile();
        if(isFile){
            // console.log(childNames[i]);
            let category=getCategory(childNames[i]);
            console.log(childNames[i],"belongs to ->",category);
            sendFile(childAddress,dest,category);
        }
    }
}
function sendFile(srcFilePath,dest,category){
    let categoryPath=path.join(dest,category);
    if(fs.existsSync(categoryPath)==false){
        fs.mkdirSync(categoryPath);
    }
    let fileName=path.basename(srcFilePath);
    let desFilePath=path.join(categoryPath,fileName);
    fs.copyFileSync(srcFilePath,desFilePath);
    console.log(fileName,"copied to ",category);
}
function helpFn(){
    console.log(`
    list of all the commands:
                node main.js tree "directoryPath"
                node main.js organize "directoryPath"
                node main.js help"
    `);
}
function getCategory(name){
    let ext=path.extname(name);
    ext=ext.slice(1);
    for(let type in types){
        let currTypeArr=types[type];
        for(let i=0;i<currTypeArr.length;i++){
            if(ext==currTypeArr[i]){
                return type;
            }
        }
    }
    return "others";

}