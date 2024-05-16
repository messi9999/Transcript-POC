import React, { useMemo } from 'react';
import { useDropzone } from 'react-dropzone';



export default function FileUpload({ onFileUpload, fileExtension }) {
    const {  getRootProps,
        getInputProps,
        isFocused,
        isDragAccept,
        isDragReject } = useDropzone({
        onDrop: onFileUpload,
        multiple: false, // Set to true if you want to allow multiple files
        accept: fileExtension, // Accept all video formats or specify like 'video/mp4'
        maxFiles:1
    });


    const style = useMemo(() => {
        // Define styles inside useMemo
        const baseStyle = {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '20px',
          borderWidth: 2,
          borderRadius: 2,
          borderColor: '#eeeeee',
          borderStyle: 'dashed',
          backgroundColor: '#fafafa',
          color: '#bdbdbd',
          outline: 'none',
          transition: 'border .24s ease-in-out',
        };
    
        const focusedStyle = {
          borderColor: '#2196f3',
        };
    
        const acceptStyle = {
          borderColor: '#00e676',
        };
    
        const rejectStyle = {
          borderColor: '#ff1744',
        };
    
        return {
          ...baseStyle,
          ...(isFocused ? focusedStyle : {}),
          ...(isDragAccept ? acceptStyle : {}),
          ...(isDragReject ? rejectStyle : {}),
        };
      }, [isFocused, isDragAccept, isDragReject]);


  return (
    <div className="container">
      <div {...getRootProps({style})}>
        <input {...getInputProps()} />
        <p>Drag and drop some files here, or click to select files</p>
      </div>
    </div>
  );
}
