import React, { useEffect, useState } from 'react'
import FileUpload from '../components/FileUpload'
import { useNavigate } from 'react-router-dom';
import '../App.css'
import { BASE_URL } from '../config/config';

export default function MainDashboard() {
  let navigate = useNavigate();
  const token = localStorage.getItem("token")

  const [fileList, setFileList] = useState([]);
  const [selectedFromS3, setSeletedFromS3] = useState([]);
  const [isLoadingS3, setIsLoadingS3] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [s3Url, setS3Url] = useState('')
  const [isReadyTranscribe, setIsReadyStanscribe] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false)

  const [trans, setTrans] = useState()

  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  useEffect(() => {
    // Define the function to fetch the file list
    const fetchFileList = async () => {
      try {
        const response = await fetch(BASE_URL + '/api/s3-files/', { // Replace with your actual endpoint
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`
          },
          // If you're using session-based authentication or tokens, you might need to include credentials or headers
        }); // Replace with your actual endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setFileList(data);
        setIsLoadingS3(false)
      } catch (error) {
        console.error("Failed to fetch file list:", error);
      }
    };

    // Call the function
    fetchFileList();
  }, [token]);

  const handleFileUpload = (files) => {
    const fileToUpload = files[0];
    setSelectedFile(fileToUpload)
  };

  const handleS3Upload = () => {
    if (!selectedFile) {
      alert('Please select a file first!');
      return;
    }
    setIsUploading(true)
    const formData = new FormData();
    formData.append('file', selectedFile);

    fetch(BASE_URL + '/api/upload/', { // Replace with your actual endpoint
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Token ${token}`
      },
      // If you're using session-based authentication or tokens, you might need to include credentials or headers
    })
      .then(response => response.json())
      .then((data) => {
        setS3Url(data.file_url)
        setIsReadyStanscribe(true)
        const newItem = {
          Key: selectedFile.name,
          FileURL: data.file_url,
          Size: selectedFile.size,
          ETag: ''
        }
        setFileList(prevSelected => [...prevSelected, newItem]);
        setIsUploading(false);
      })
      .catch(error => console.error('Error uploading file:', error));
  }

  const handleVideolSelect = (file) => {
    setSeletedFromS3(file.Key)
    setS3Url(file.FileURL)
    setIsReadyStanscribe(true)
  }

  const handleOnTranscribe = (key) => {
    if (!selectedFile && !isReadyTranscribe) {
      alert('Please select a file first!');
      return;
    }
    setIsTranscribing(true)


    let endpoint = '/api/transcribe/'
    if (key === 'G') {
      endpoint = '/api/transcribe/'
    } else if (key === 'M') {
      endpoint = '/api/transcribe-medical/'
    }

    fetch(BASE_URL + endpoint, { // Replace with your actual endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`, // Replace with your actual token
      },
      body: JSON.stringify({ s3_url: s3Url }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setTrans(data.results.transcripts[0].transcript)
        setIsTranscribing(false)
      })
      .catch(error => {
        console.error('Error starting transcription job:', error);
      });
  }

  return (
    <div className='main-body'>
      <div className='main-dashboard'>
        {isLoadingS3 && (
          <div className="loading-overlay">
            <div className="loading-message">Loading Video lists from S3...</div>
          </div>
        )}
        <div className='main-dashboard-dropbox'>
          <FileUpload onFileUpload={handleFileUpload} />
          <button
            onClick={handleS3Upload}
            className={selectedFile ? 'upload-button-active' : 'upload-button-inactive'}
            disabled={!selectedFile || isLoadingS3}
          >
            Upload
          </button>
        </div>
        <div>
          <div className='file-list'>
            {fileList.map((file, index) => (
              <div
                key={index}
                className={`file-item ${selectedFromS3 === file.Key ? 'selected' : ''}`}
                onClick={() => handleVideolSelect(file)}
              >
                {file.Key}
              </div>
            ))}
          </div>
        </div>
        <div className='button-group'>
          <button
            className={`main-dashboard-transcribe-btn ${isReadyTranscribe ? 'transcribe-button-active' : 'transcribe-button-inactive'}`}
            onClick={() => { handleOnTranscribe('G') }}
            disabled={!isReadyTranscribe || isLoadingS3}
          >
            General English
          </button>
          <button
            className={`main-dashboard-transcribe-btn ${isReadyTranscribe ? 'transcribe-button-active' : 'transcribe-button-inactive'}`}
            onClick={() => { handleOnTranscribe('M') }}
            disabled={!isReadyTranscribe || isLoadingS3}
          >
            Medical English
          </button>
        </div>
        <div>
          {(isTranscribing || isUploading) && (
            <div className="transcribing-overlay">
              <div className="transcribing-loader"></div>
            </div>
          )}
          <textarea
            value={trans}
            className="transcription-result"
            placeholder="Transcription result will appear here..."
            readOnly  // Remove this if you want to allow editing
          />
        </div>
      </div>
    </div>
  )
}
